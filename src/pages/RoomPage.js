import { Helmet } from 'react-helmet-async';
import React from 'react';
import {
  Stack,
  Container,
  Typography,
} from '@mui/material';
import RoomsTable from '../tables/rooms/RoomTable';

export default function HotelPage() {
  return (
    <>
      <Helmet>
        <title>Rooms | Next Trip</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
           Rooms Page
          </Typography>
        </Stack>
        <RoomsTable />
      </Container>
      
    </>
  );
}
