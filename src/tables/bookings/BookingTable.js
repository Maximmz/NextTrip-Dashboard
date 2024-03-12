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

export default class BookingTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookings: [],
      hotels: [],
      rooms: [],
      users: [],
      selectedHotel: "",
      selectedRoom: "",
      selectedUser: "",
      checkInDate: "",
      checkOutDate: "",
      guests: 0,
      totalPrice: 0,
      paymentStatus: "pending",
      isModalOpen: false,
      modalTitle: "",
      bookingId: "",
      UserId: 0,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.fetchBookings();
    this.fetchHotels();
    this.fetchRooms();
    this.fetchUsers();
  }

  fetchBookings() {
    fetch(`${variables}bookings/`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ bookings: data });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  fetchHotels() {
    fetch(`${variables}hotels/`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ hotels: data });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  fetchRooms() {
    fetch(`${variables}rooms/`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ rooms: data });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  fetchUsers() {
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


  changeCheckInDate = (e) => {
    this.setState({ checkInDate: e.target.value });
  };

  changeCheckOutDate = (e) => {
    this.setState({ checkOutDate: e.target.value });
  };

  changeGuests = (e) => {
    this.setState({ guests: e.target.value });
  };

  changeTotalPrice = (e) => {
    this.setState({ totalPrice: e.target.value });
  };

  changePaymentStatus = (e) => {
    this.setState({ paymentStatus: e.target.value });
  };

  changeHotelId = (e) => {
    this.setState({ selectedHotel: e.target.value });
  };

  changeUserSelected = (e) => {
    this.setState({ selectedUser: e.target.value });
  };

  changeUserId = (e) => {
    this.setState({ UserId: e.target.value });
  };
  

changeRoomId = (e) => {
  this.setState({ selectedRoom: e.target.value });
};

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalOpen: !prevState.isModalOpen,
    }));
  };

  refreshList() {
    fetch(`${variables}bookings/`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ bookings: data });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  addClick = () => {
    this.setState({
      modalTitle: "Add Booking",
      bookingId: "",
      selectedHotel: "",
      selectedRoom: "",
      checkInDate: "",
      checkOutDate: "",
      guests: "",
      totalPrice: "",
      paymentStatus: "pending",
      UserId:0
    });
    this.toggleModal();
  };

  editClick = (booking) => {
    this.setState({
      modalTitle: "Edit Booking",
      bookingId: booking._id,
      UserId:booking.user,
      selectedHotel: booking.hotel,
      selectedRoom: booking.room,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      guests: booking.guests,
      totalPrice: booking.totalPrice,
      paymentStatus: booking.paymentStatus,
    });
    this.toggleModal();
  };

  createClick = () => {
    fetch(`${variables}bookings/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        user: this.state.UserId,
        hotel: this.state.selectedHotel,
        room: this.state.selectedRoom,
        checkIn: this.state.checkInDate,
        checkOut: this.state.checkOutDate,
        guests: this.state.guests,
        totalPrice: this.state.totalPrice,
        paymentStatus: this.state.paymentStatus,
      }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Booking created successfully!");
          this.toggleModal();
          this.refreshList();
        } else {
          throw new Error("Failed to create booking.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error.message);
      });
  };
  
  

  updateClick = () => {
    fetch(`${variables}bookings/${this.state.bookingId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        user:this.state.UserId,
        hotel: this.state.selectedHotel,
        room: this.state.selectedRoom,
        checkIn: this.state.checkInDate,
        checkOut: this.state.checkOutDate,
        guests: this.state.guests,
        totalPrice: this.state.totalPrice,
        paymentStatus: this.state.paymentStatus
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        alert("Booking updated successfully!");
        this.toggleModal();
        this.refreshList();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to update booking.");
      });
  };
  

  deleteClick = (booking) => {
    if (window.confirm("Are you sure you want to delete?")) {
      fetch(`${variables}bookings/${booking._id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          alert("Booking deleted successfully!");
          this.refreshList();
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to delete booking.");
        });
    }
  };

  render() {
    const {
      bookings,
      hotels,
      rooms,
      users,
      modalTitle,
      selectedHotel,
      selectedRoom,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
      paymentStatus,
      isModalOpen,
      UserId,
    } = this.state;

    const getHotelName = (id) => {
      const hotel = hotels.find((hotel) => hotel._id === id);
      return hotel ? hotel.name : "";
    };

    const getRoomName = (id) => {
      console.log(rooms);
      const room = rooms.find((room) => room._id === id);
      return room ? room.title : "";
    };

    const getUserName = (id) => {
      const user = users.find((user) => user._id === id);
      return user ? user.username : "";
    };

    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          style={{ float: "left", marginBottom: "10px" }}
          onClick={this.addClick}
        >
          Add Booking
        </Button>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hotel</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Check-In</TableCell>
              <TableCell>Check-Out</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings &&
              bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{getHotelName(booking.hotel)}</TableCell>
                  <TableCell>{getRoomName(booking.room)}</TableCell>
                  <TableCell>{getUserName(booking.user)}</TableCell>
                  <TableCell>{booking.checkIn}</TableCell>
                  <TableCell>{booking.checkOut}</TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>{booking.totalPrice}</TableCell>
                  <TableCell>{booking.paymentStatus}</TableCell>
                  <TableCell>
                    <Icon
                      icon={editIcon}
                      onClick={() => this.editClick(booking)}
                      style={{
                        cursor: "pointer",
                        fontSize: "24px",
                        color: blue[700],
                        marginRight: "10px",
                      }}
                    />
                    <Icon
                      icon={deleteIcon}
                      onClick={() => this.deleteClick(booking)}
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
            <Typography variant="h6" id="modal-title">
              {modalTitle}
            </Typography>
            <Stack spacing={2}>
            <Select
                value={UserId}
                onChange={this.changeUserId}
                label="Users"
              >
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
              <Select
                value={selectedHotel}
                onChange={this.changeHotelId}
                label="Hotel"
              >
                {hotels.map((hotel) => (
                  <MenuItem key={hotel._id} value={hotel._id}>
                    {hotel.name}
                  </MenuItem>
                ))}
              </Select>
              <Select
                value={selectedRoom}
                onChange={this.changeRoomId}
                label="Room"
              >
                {rooms.map((room) => (
                  <MenuItem key={room._id} value={room._id}>
                    {room.title}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                type="date"
                value={checkInDate}
                onChange={this.changeCheckInDate}
                label="Check-in Date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                type="date"
                value={checkOutDate}
                onChange={this.changeCheckOutDate}
                label="Check-out Date"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                type="number"
                value={guests}
                onChange={this.changeGuests}
                label="Guests"
              />
              <TextField
                type="number"
                value={totalPrice}
                onChange={this.changeTotalPrice}
                label="Total Price"
              />
              <TextField
                value={paymentStatus}
                onChange={this.changePaymentStatus}
                label="Payment Status"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={
                  modalTitle === "Add Booking" ? this.createClick : this.updateClick
                }
              >
                {modalTitle === "Add Booking" ? "Create" : "Update"}
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
