import React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'

function Profiles() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Tooltip title='Account settings'>
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 30, height: 30 }}
            alt='Avatar'
            src='https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-1/457410205_3920785784910042_3248882197144578988_n.jpg?stp=cp6_dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=4hpWHp9Z3VcQ7kNvgHZ0rHi&_nc_zt=24&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=Ad9Q5pTd9jPHtkB8jBiHhIU&oh=00_AYAibRw6_AZ3qfDn4S1bNEe0726gRRJomkElA6cuTr-Ejg&oe=6758B1E5'
          />
        </IconButton>
      </Tooltip>
      <Menu
        id='basic-menu-profiles'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles',
        }}
      >
        <MenuItem>
          <Avatar sx={{ height: 20, width: 20, mr: 2 }} /> Profile
        </MenuItem>
        <MenuItem>
          <Avatar sx={{ height: 20, width: 20, mr: 2 }} /> My account
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize='small' />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize='small' />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles
