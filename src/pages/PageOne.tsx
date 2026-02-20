import { Box, Button, Container, Paper, Typography } from '@mui/material';

import { useTranslation } from 'react-i18next';
import ErrorButtons from '../components/ErrorButtons';
import DarkModeSwitch from '../components/ui/DarkModeSwitch';

import TestSetter from '../components/TestSetter';
import TestSetterDict from '../components/TestSetterDict';
import ClassicSelectLanguageSwitcher from '../components/ui/lang/ClassicSelectLanguageSwitcher';
import IconLanguageSwitcher from '../components/ui/lang/IconLanguageSwitcher';

export default function PageOne() {
  const { t } = useTranslation();
  const { t: tAuth } = useTranslation('auth');

  return (
    <Container
      sx={{
        mt: 4,
        minWidth: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Paper
        sx={{
          p: 2,
        }}
      >
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          sx={{
            backgroundColor: theme => theme.palette.primary.main,
            color: theme => theme.palette.background.paper,
            p: 2,
            borderRadius: 2,
            textAlign: 'center',
            boxShadow: 1,
            mb: 3,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          {t('title')}
        </Typography>
        <Typography variant='body1' gutterBottom>
          {t('description')}- {tAuth('login')}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button variant='contained' color='primary'>
            Get Started
          </Button>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <DarkModeSwitch />
        </Box>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' }, // column on xs, row on sm and up
          }}
        >
          <ErrorButtons />
        </Box>
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <ClassicSelectLanguageSwitcher />
          <IconLanguageSwitcher />
        </Box>
      </Paper>
      <Paper
        elevation={1}
        sx={{
          p: 2,
        }}
      >
        <Typography>Elevation 1</Typography>
        <Button variant='outlined' color='primary'>
          Click Me
        </Button>
        <Button variant='outlined' color='secondary'>
          Click Me
        </Button>
      </Paper>
      <Paper
        elevation={2}
        sx={{
          p: 2,
        }}
      >
        <Typography>Elevation 2</Typography>
        <Button variant='contained' color='primary'>
          Click Me
        </Button>
        <Button variant='contained' color='secondary'>
          Click Me
        </Button>
      </Paper>
      <Paper
        elevation={3}
        sx={{
          p: 2,
        }}
      >
        <Typography>Elevation 3</Typography>
      </Paper>
      <TestSetter />
      <TestSetterDict />
    </Container>
  );
}
