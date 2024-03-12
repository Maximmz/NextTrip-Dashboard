import { Helmet } from 'react-helmet-async';
import React from 'react';
import {
  Stack,
  Container,
  Typography,
} from '@mui/material';
import UserTable from '../tables/users/UsersTable';

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title>User | Next Trip</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
        </Stack>
        <UserTable />
      </Container>
      
    </>
  );
}
