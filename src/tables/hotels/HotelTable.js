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
} from "@mui/material";
import { Icon } from "@iconify/react";
import editIcon from "@iconify-icons/mdi/edit";
import deleteIcon from "@iconify-icons/mdi/delete";
import { blue,red } from "@mui/material/colors";

const variables = "http://localhost:8800/api/";
const user = JSON.parse(localStorage.getItem("user"));

export default class HotelTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hotels: [],
      hotelName: "",
      hotelLocation: "",
      hotelArea: "",
      hotelDistance: "",
      hotelDescription: "",
      hotelCheapestPrice: 0,
      isModalOpen: false,
      modalTitle: "",
      hotelId: "",
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  changeName = (e) => {
    this.setState({ hotelName: e.target.value });
  };

  changeLocation = (e) => {
    this.setState({ hotelLocation: e.target.value });
  };

  changeArea = (e) => {
    this.setState({ hotelArea: e.target.value });
  };

  changeDistance = (e) => {
    this.setState({ hotelDistance: e.target.value });
  };

  changeDescription = (e) => {
    this.setState({ hotelDescription: e.target.value });
  };

  changeCheapestPrice = (e) => {
    this.setState({ hotelCheapestPrice: e.target.value });
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalOpen: !prevState.isModalOpen,
    }));
  };

  refreshList() {
    fetch(`${variables}hotels/`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ hotels: data });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  addClick = () => {
    this.setState({
      modalTitle: "Add Hotel",
      hotelId: "",
      hotelName: "",
      hotelLocation: "",
      hotelArea: "",
      hotelDistance: "",
      hotelDescription: "",
      hotelCheapestPrice: 0,
    });
    this.toggleModal();
  };

  editClick = (hotel) => {
    this.setState({
      modalTitle: "Edit Hotel",
      hotelId: hotel._id,
      hotelName: hotel.name,
      hotelLocation: hotel.location,
      hotelArea: hotel.area,
      hotelDistance: hotel.distance,
      hotelDescription: hotel.description,
      hotelCheapestPrice: hotel.cheapestPrice,
    });
    this.toggleModal();
  };

  createClick = () => {
    fetch(`${variables}hotels/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        name: this.state.hotelName,
        location: this.state.hotelLocation,
        area: this.state.hotelArea,
        distance: this.state.hotelDistance,
        description: this.state.hotelDescription,
        cheapestPrice: this.state.hotelCheapestPrice,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        alert("Hotel created successfully!");
        this.toggleModal();
        this.refreshList();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to create hotel.");
      });
  };

  updateClick = () => {
    fetch(`${variables}hotels/${this.state.hotelId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        name: this.state.hotelName,
        location: this.state.hotelLocation,
        area: this.state.hotelArea,
        distance: this.state.hotelDistance,
        description: this.state.hotelDescription,
        cheapestPrice: this.state.hotelCheapestPrice,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        alert("Hotel updated successfully!");
        this.toggleModal();
        this.refreshList();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to update hotel.");
      });
  };

  deleteClick = (hotel) => {
    if (window.confirm("Are you sure you want to delete?")) {
      fetch(`${variables}hotels/${hotel._id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          alert("Hotel deleted successfully!");
          this.refreshList();
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to delete hotel.");
        });
    }
  };

  render() {
    const {
      hotels,
      modalTitle,
      hotelName,
      hotelLocation,
      hotelArea,
      hotelDistance,
      hotelDescription,
      hotelCheapestPrice,
      isModalOpen,
    } = this.state;

    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          style={{ float: "left", marginBottom: "10px" }}
          onClick={this.addClick}
        >
          Add Hotel
        </Button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hotel ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Distance</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotels &&
              hotels.map((hotel) => (
                <TableRow key={hotel._id}>
                  <TableCell>{hotel._id}</TableCell>
                  <TableCell>{hotel.name}</TableCell>
                  <TableCell>{hotel.location}</TableCell>
                  <TableCell>{hotel.area}</TableCell>
                  <TableCell>{hotel.distance}</TableCell>
                  <TableCell>
                    <Icon
                      icon={editIcon}
                      onClick={() => this.editClick(hotel)}
                      style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        color: blue[700],
                        marginRight: "10px",
                      }}
                    />
                    <Icon
                      icon={deleteIcon}
                      onClick={() => this.deleteClick(hotel)}
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
                value={hotelName}
                onChange={this.changeName}
              />
              <TextField
                label="Location"
                value={hotelLocation}
                onChange={this.changeLocation}
              />
              <TextField
                label="Area"
                value={hotelArea}
                onChange={this.changeArea}
              />
              <TextField
                label="Distance"
                value={hotelDistance}
                onChange={this.changeDistance}
              />
              <TextField
                label="Description"
                value={hotelDescription}
                onChange={this.changeDescription}
              />
              <TextField
                label="Cheapest Price"
                value={hotelCheapestPrice}
                onChange={this.changeCheapestPrice}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={
                  modalTitle === "Add Hotel" ? this.createClick : this.updateClick
                }
              >
                {modalTitle === "Add Hotel" ? "Create" : "Update"}
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
