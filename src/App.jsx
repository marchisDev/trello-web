import Button from '@mui/material/Button'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material/styles'

function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light')
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  )
}
function App() {
  return (
    <>
      <ModeToggle />
      <hr/>
      <div>marchisDev</div>

      <Typography variant='body2' color='text.secondary'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae,
        magni excepturi, atque voluptas tenetur alias tempore harum fuga, qui
        saepe earum omnis molestiae corporis blanditiis non quibusdam debitis
        enim exercitationem!
      </Typography>

      <Button variant='text'>Text</Button>
      <Button variant='contained'>Contained</Button>
      <Button variant='outlined'>Outlined</Button>

      <AccessAlarmIcon />
      <ThreeDRotation />
    </>
  )
}

export default App
