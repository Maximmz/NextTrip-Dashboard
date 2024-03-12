import { Helmet } from 'react-helmet-async';
import React from 'react';
import {
  Stack,
  Container,
  Typography,
} from '@mui/material';
import BookingsTable from '../tables/bookings/BookingTable';

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title>Booking | Next Trip</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Bookings Page
          </Typography>
        </Stack>
        <BookingsTable />
      </Container>
      
    </>
  );
}
