import { Button, Paper, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../stores/hooks';
import { removeKeyFromDict, setDictOfValues } from '../stores/slices/test1Slice';

export default function TestSetterDict() {
  const extDict = useAppSelector(state => state.testOne.dictOfValues);

  const dispatch = useAppDispatch();

  console.log('TestSetterDict render');
  console.log('extDict', extDict);
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
      }}
    >
      <Typography>Slice</Typography>

      <div>
        <Button
          variant='contained'
          color='primary'
          onClick={() => dispatch(setDictOfValues({ dictKey: 'exKey1', value: 'Value1' }))}
        >
          add exampleKey
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={() => dispatch(setDictOfValues({ dictKey: 'exKey2', value: 'Value2' }))}
        >
          add exampleKey
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={() => dispatch(setDictOfValues({ dictKey: 'exKey2', value: 'Vax' }))}
        >
          change exampleKey2
        </Button>
        <Button
          variant='contained'
          color='secondary'
          onClick={() => dispatch(removeKeyFromDict({ dictKey: 'exKey2' }))}
        >
          remove exampleKey2
        </Button>
        <div>{JSON.stringify(extDict)}</div>
      </div>
    </Paper>
  );
}
