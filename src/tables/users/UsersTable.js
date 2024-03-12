import React from "react";
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Modal,
  Box,
  Typography,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import { Icon } from "@iconify/react";
import editIcon from "@iconify-icons/mdi/edit";
import deleteIcon from "@iconify-icons/mdi/delete";
import { blue, red } from "@mui/material/colors";

const variables = "http://localhost:8800/api/";
const user = JSON.parse(localStorage.getItem("user"));

export default class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      userName: "",
      userEmail: "",
      userPassword: "",
      userId: "",
      isAdmin: "",
      isModalOpen: false,
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  changeName = (e) => {
    this.setState({ userName: e.target.value });
  };

  changesIsAdmin = (e) => {
    this.setState({ isAdmin: e.target.value });
  };

  changeEmail = (e) => {
    this.setState({ userEmail: e.target.value });
  };

  changePassword = (e) => {
    this.setState({ userPassword: e.target.value });
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalOpen: !prevState.isModalOpen,
    }));
    this.refreshList();
  };

  refreshList() {
    if (!user || !user.token) {
      return user;
    }

    fetch(`${variables}users/`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ users: data });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  addClick = () => {
    this.setState({
      modalTitle: "Add User",
      userId: "",
      userName: "",
      userEmail: "",
      userPassword: "",
      isAdmin: "",
    });
    this.toggleModal();
  };

  editClick = (cs) => {
    this.setState({
      modalTitle: "Edit User",
      userId: cs._id,
      userName: cs.username,
      userEmail: cs.email,
      userPassword: cs.password,
      isAdmin: cs.isAdmin,
    });
    this.toggleModal();
  };

  createClick = () => {
    fetch(`${variables}auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        username: this.state.userName,
        email: this.state.userEmail,
        password: this.state.userPassword,
        isAdmin: this.state.isAdmin,
      }),
    })
      .then((res) => {
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return res.json();
          } else {
            // Handle plain text response
            return res.text().then((text) => {
              throw new Error(text);
            });
          }
        } else {
          throw new Error("Failed to create user.");
        }
      })
      .then((result) => {
        alert("User created successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error.message);
      })
      .finally(() => {
        this.setState({
          userName: "",
          userEmail: "",
          userPassword: "",
          isAdmin: "",
        });
        this.refreshList();
        this.toggleModal();
      });
  };

  updateClick = () => {
    const { userId, userName, userEmail, userPassword, isAdmin } = this.state;
  
    fetch(`${variables}users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        username: userName,
        email: userEmail,
        password: userPassword,
        isAdmin: isAdmin,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to update user.");
        }
      })
      .then((result) => {
        alert("Successfully updated user!");
        this.toggleModal();
        this.refreshList();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error.message);
      });
  };
  

  deleteClick = (cs) => {
    if (window.confirm("Are you sure you want to delete?")) {
      fetch(`${variables}users/${cs._id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((res) => res.json())
        .then(
          (result) => {
            alert(result);
            this.refreshList();
          },
          () => {
            alert("Failed");
          }
        );
    }
  };

  render() {
    const {
      users,
      modalTitle,
      userId,
      userName,
      userEmail,
      isModalOpen,
      isAdmin,
    } = this.state;
    console.log(isAdmin);

    console.log(users);
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          style={{ float: "left", marginBottom: "10px" }}
          onClick={this.addClick}
        >
          Add User
        </Button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map((cs) => (
                <TableRow key={cs._id}>
                  <TableCell>{cs._id}</TableCell>
                  <TableCell>{cs.username}</TableCell>
                  <TableCell>{cs.email}</TableCell>
                  <TableCell>{cs.createdAt}</TableCell>
                  <TableCell>{cs.isAdmin.toString()}</TableCell>
                  <TableCell>
                    <Icon
                      icon={editIcon}
                      onClick={() => this.editClick(cs)}
                      style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        color: blue[700],
                        marginRight: "10px",
                      }}
                    />
                    <Icon
                      icon={deleteIcon}
                      onClick={() => this.deleteClick(cs)}
                      style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        color: red[700],
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Modal open={isModalOpen} onClose={this.toggleModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              {modalTitle}
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Name"
                variant="outlined"
                value={userName}
                onChange={this.changeName}
              />
              <TextField
                label="Email"
                variant="outlined"
                value={userEmail}
                onChange={this.changeEmail}
              />
              <Select
                label="Is Admin"
                variant="outlined"
                value={isAdmin}
                onChange={this.changesIsAdmin}
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
              <Button
                variant="contained"
                color="primary"
                onClick={userId ? this.updateClick : this.createClick}
              >
                {userId ? "Update" : "Create"}
              </Button>
              <Button variant="contained" onClick={this.toggleModal}>
                Close
              </Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    );
  }
}
