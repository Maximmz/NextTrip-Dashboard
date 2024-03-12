import React, { Component } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  Box,
  Typography,
  TextField,
  Stack,
  Chip,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Icon } from "@iconify/react";
import editIcon from "@iconify-icons/mdi/edit";
import deleteIcon from "@iconify-icons/mdi/delete";
import { blue,red } from "@mui/material/colors";

const variables = "http://localhost:8800/api/";
const user = JSON.parse(localStorage.getItem("user"));

class Rooms extends Component {
  state = {
    rooms: [],
    hotels: [],
    modalTitle: "",
    roomTitle: "",
    roomPrice: "",
    roomMaxPeople: "",
    roomDesc: "",
    roomNumbers: [],
    createdAt: "",
    updatedAt: "",
    isModalOpen: false,
    selectedHotel: "",
    _id: "",
    newRoomNumber: "",
  };

  componentDidMount() {
    this.fetchRooms();
    this.fetchHotels();
  }

  fetchRooms = () => {
    fetch(`${variables}rooms/`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ rooms: data });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to fetch rooms.");
      });
  };

  fetchHotels = () => {
    fetch(`${variables}hotels/`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ hotels: data });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to fetch hotels.");
      });
  };

  addClick = () => {
    this.setState({
      modalTitle: "Add Room",
      roomTitle: "",
      roomPrice: "",
      roomMaxPeople: "",
      roomDesc: "",
      roomNumbers: [],
      createdAt: "",
      updatedAt: "",
      isModalOpen: true,
      selectedHotel: "", // Initialize selectedHotel to an empty string
    });
  };

  editClick = (roomId) => {
    const { rooms } = this.state;
    const room = rooms.find((room) => room._id === roomId);
  
    if (room) {
      this.setState({
        _id: roomId, // Store the room ID in the state
        modalTitle: "Edit Room",
        roomTitle: room.title,
        roomPrice: room.price,
        roomMaxPeople: room.maxPeople,
        roomDesc: room.desc,
        roomNumbers: room.roomNumbers.map((number) => number.number),
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        isModalOpen: true,
        selectedHotel: room.hotel,
      });
    }
  };
  

  addRoomNumber = () => {
    const { roomNumbers, newRoomNumber } = this.state;

    if (newRoomNumber.trim() !== "") {
      this.setState({
        roomNumbers: [...roomNumbers, newRoomNumber.trim()],
        newRoomNumber: "",
      });
    }
  };

  removeRoomNumber = (roomNumber) => {
    const { roomNumbers } = this.state;

    const updatedRoomNumbers = roomNumbers.filter((number) => number !== roomNumber);

    this.setState({
      roomNumbers: updatedRoomNumbers,
    });
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalOpen: !prevState.isModalOpen,
    }));
  };

  changeTitle = (event) => {
    this.setState({ roomTitle: event.target.value });
  };

  changePrice = (event) => {
    this.setState({ roomPrice: event.target.value });
  };

  changeMaxPeople = (event) => {
    this.setState({ roomMaxPeople: event.target.value });
  };

  changeDesc = (event) => {
    this.setState({ roomDesc: event.target.value });
  };

  handleHotelChange = (event) => {
    this.setState({ selectedHotel: event.target.value });
  };

  changeRoomNumbers = (event) => {
    this.setState({ newRoomNumber: event.target.value });
  };

  createClick = () => {
    const {
      roomTitle,
      roomPrice,
      roomMaxPeople,
      roomDesc,
      selectedHotel,
      roomNumbers,
    } = this.state;
  
    const roomData = {
      hotel: selectedHotel,
      title: roomTitle,
      price: parseInt(roomPrice),
      maxPeople: parseInt(roomMaxPeople),
      desc: roomDesc,
      roomNumbers: roomNumbers.map((number) => ({
        number: number,
        unavailableDates: [],
      })),
    };
  
    fetch(`${variables}rooms/${selectedHotel}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(roomData),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to create room.");
        }
      })
      .then((data) => {
        alert("Room created successfully!");
        this.fetchRooms();
        this.toggleModal();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error.message);
      });
  };
  
  
    

  updateClick = () => {
    const { _id, roomTitle, roomPrice, roomMaxPeople, roomDesc, roomNumbers } = this.state; // Access the room ID from the state
    fetch(`${variables}rooms/${_id}`, {
      // Use the room ID in the fetch URL
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        _id: _id,
        title: roomTitle,
        price: parseInt(roomPrice),
        maxPeople: parseInt(roomMaxPeople),
        desc: roomDesc,
        roomNumbers: roomNumbers, // Use the roomNumbers from the state
        updatedAt: new Date(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Room updated successfully!");
        this.fetchRooms();
        this.toggleModal();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to update room.");
      });
  };

  deleteClick = (roomId, hotel) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      fetch(`${variables}rooms/${roomId}/${hotel}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          alert("Room deleted successfully!");
          this.fetchRooms();
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to delete room.");
        });
    }
  };

  render() {
    const {
      rooms,
      modalTitle,
      roomTitle,
      roomPrice,
      roomMaxPeople,
      roomDesc,
      roomNumbers,
      createdAt,
      updatedAt,
      isModalOpen,
      hotels,
      selectedHotel,
      newRoomNumber,
    } = this.state;

    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          style={{ float: "left", marginBottom: "10px" }}
          onClick={this.addClick}
        >
          Add Room
        </Button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>People</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Room No's</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room._id}>
                <TableCell>{room.title}</TableCell>
                <TableCell>{room.price}</TableCell>
                <TableCell>{room.maxPeople}</TableCell>
                <TableCell>{room.desc}</TableCell>
                <TableCell>
                  {room.roomNumbers.map((number) => (
                    <Chip
                      key={number._id}
                      label={number.number}
                      style={{ margin: "1px" }}
                      variant="outlined"
                    />
                  ))}
                </TableCell>
                <TableCell>{room.createdAt}</TableCell>
                <TableCell>{room.updatedAt}</TableCell>
                <TableCell>
                <TableCell>
                    <Icon
                      icon={editIcon}
                      onClick={() => this.editClick(room._id)}
                      style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        color: blue[700],
                        marginRight: "10px",
                      }}
                    />
                    <Icon
                      icon={deleteIcon}
                      onClick={() => this.deleteClick(room._id,room.hotel)}
                      style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        color: red[700],
                      }}
                    />
                  </TableCell>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Modal */}
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
            <Typography variant="h6" gutterBottom>
              {modalTitle}
            </Typography>
            <Stack spacing={2}>
              <InputLabel id="hotel-label">Hotel</InputLabel>
              <Select
                value={selectedHotel}
                onChange={this.handleHotelChange}
                label="Hotel"
              >
                {hotels.map((hotel) => (
                  <MenuItem key={hotel._id} value={hotel._id}>
                    {hotel.name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                label="Title"
                value={roomTitle}
                onChange={this.changeTitle}
              />
              <TextField
                label="Price"
                value={roomPrice}
                onChange={this.changePrice}
              />
              <InputLabel id="max-people-label">Max People</InputLabel>
              <Select
                labelId="max-people-label"
                value={roomMaxPeople}
                onChange={this.changeMaxPeople}
              >
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={6}>6</MenuItem>
              </Select>

              <TextField
                label="Description"
                value={roomDesc}
                onChange={this.changeDesc}
              />

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  label="Room Number"
                  value={newRoomNumber}
                  onChange={this.changeRoomNumbers}
                />
                <Button
                  variant="outlined"
                  onClick={this.addRoomNumber}
                  sx={{ marginLeft: "10px" }}
                >
                  Add
                </Button>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {roomNumbers.map((number) => (
                  <Chip
                    key={number}
                    label={number}
                    onDelete={() => this.removeRoomNumber(number)}
                    style={{ margin: "5px" }}
                  />
                ))}
              </Box>

              {modalTitle === "Edit Room" && (
                <Typography variant="subtitle1">
                  Created At: {createdAt}
                </Typography>
              )}
              {modalTitle === "Edit Room" && (
                <Typography variant="subtitle1">
                  Updated At: {updatedAt}
                </Typography>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={
                  modalTitle === "Add Room" ? this.createClick : this.updateClick
                }
              >
                {modalTitle === "Add Room" ? "Create" : "Update"}
              </Button>
              <Button onClick={this.toggleModal}>Cancel</Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    );
  }
}

export default Rooms;
