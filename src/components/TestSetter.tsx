import { Box, Button, Paper, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../stores/hooks';
import {
  setExampleSentiment,
  setExampleToggle,
  setExampleVarBool,
  setExampleVarNum,
  setExampleVarStr,
} from '../stores/slices/test1Slice';

export default function TestSetter() {
  const extVarStr = useAppSelector(state => state.testOne.exampleVarStr);
  const extVarNum = useAppSelector(state => state.testOne.exampleVarNum);
  const extVarBool = useAppSelector(state => state.testOne.exampleVarBool);
  const extVarSentiment = useAppSelector(state => state.testOne.exampleSentiment);
  const extVarToggle = useAppSelector(state => state.testOne.exampleToggle);
  const dispatch = useAppDispatch();

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
      }}
    >
      <Typography>Slice</Typography>
      <Box
        sx={{
          p: 2,
          mt: 2,
          gap: 2,
          display: 'flex',
          flexDirection: 'column',

          // backgroundColor: 'transparent',
        }}
      >
        <div>
          <Button
            variant='contained'
            color='primary'
            onClick={() => dispatch(setExampleVarStr('New value from TestSetter'))}
          >
            Click Me
          </Button>
          {extVarStr}
        </div>
        <div>
          <Button variant='contained' color='primary' onClick={() => dispatch(setExampleVarNum(extVarNum + 2))}>
            Click Me
          </Button>
          {extVarNum}
        </div>
        <div>
          <Button variant='contained' color='primary' onClick={() => dispatch(setExampleVarBool(true))}>
            Click Me
          </Button>
          {extVarBool.toString()}
        </div>
        <div>
          <Button variant='contained' color='primary' onClick={() => dispatch(setExampleSentiment('positive'))}>
            Click Me
          </Button>
          {extVarSentiment}
        </div>
        <div>
          <Button variant='contained' color='primary' onClick={() => dispatch(setExampleToggle())}>
            Toggler
          </Button>
          {extVarToggle.toString()}
        </div>
      </Box>
    </Paper>
  );
}
