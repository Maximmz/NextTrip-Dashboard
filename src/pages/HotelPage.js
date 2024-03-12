import { Helmet } from 'react-helmet-async';
import React from 'react';
import {
  Stack,
  Container,
  Typography,
} from '@mui/material';
import HotelTable from '../tables/hotels/HotelTable';

export default function HotelPage() {
  return (
    <>
      <Helmet>
        <title>Hotel | Next Trip</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Hotels Page
          </Typography>
        </Stack>
        <HotelTable />
      </Container>
      
    </>
  );
}
