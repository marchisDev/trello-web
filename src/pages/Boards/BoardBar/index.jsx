import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': { color: 'white' },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
function BoardBar() {
  return (
    <Box
      sx={{
        height: (theme) => theme.trello.boardBarHeight,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflowX: 'auto',
        gap: 2,
        px: 2,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        borderBottom: '1px solid white'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label='marchisDev Trello'
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label='Public/Private Workspace'
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label='Add To Google Drive'
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label='Automation'
          clickable
        />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label='Filters'
          clickable
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant='outlined'
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
          startIcon={<PersonAddIcon />}
        >
          Invite
        </Button>
        <AvatarGroup
          max={7}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: '36px',
              height: '36px',
              fontSize: '16px',
              border: 'none'
            }
          }}
        >
          <Tooltip title='marchisDev'>
            <Avatar
              alt='marchisDev'
              src='https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-1/457410205_3920785784910042_3248882197144578988_n.jpg?stp=cp6_dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=4hpWHp9Z3VcQ7kNvgHZ0rHi&_nc_zt=24&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=Ad9Q5pTd9jPHtkB8jBiHhIU&oh=00_AYAibRw6_AZ3qfDn4S1bNEe0726gRRJomkElA6cuTr-Ejg&oe=6758B1E5'
            />
          </Tooltip>
          <Tooltip title='marchisDev'>
            <Avatar
              alt='marchisDev'
              src='https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/307981984_3388092178179408_8389189519181409627_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=5XDGd7cPbL8Q7kNvgErjDh-&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=AKm91CjknnveYFPMS3LtRm4&oh=00_AYDPWWjMdS7xwO2vCTIXbLq84XFx23oAvsG-O98OTvphKQ&oe=6766209A'
            />
          </Tooltip>
          <Tooltip title='marchisDev'>
            <Avatar
              alt='marchisDev'
              src='https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-6/301780876_3365593777095915_1518459314662637891_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=EzUmdNzGuUIQ7kNvgEt3YoE&_nc_zt=23&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=A9WicyY0NGAh2CCJhQ91mcd&oh=00_AYBIIqu6a-FMK15aiOQKxXsnAtNNp-mA2tD-esatB3X_cg&oe=676627F7'
            />
          </Tooltip>
          <Tooltip title='marchisDev'>
            <Avatar
              alt='marchisDev'
              src='https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/469407545_1987839181693246_5551279053121680557_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=fe5ecc&_nc_ohc=yu2393-ZhF4Q7kNvgFbDgOS&_nc_zt=23&_nc_ht=scontent.fsgn2-3.fna&_nc_gid=A8_lFeEwmC1jB13bcdrODPO&oh=00_AYCc37pAnk7fe1sPlnBwmoRsNuzV9M0HlqTn4tuC_7YcHQ&oe=67660F55'
            />
          </Tooltip>
          <Tooltip title='marchisDev'>
            <Avatar
              alt='marchisDev'
              src='https://scontent.fsgn2-6.fna.fbcdn.net/v/t39.30808-6/341614501_765568548259007_738827607475281006_n.jpg?stp=c0.296.1152.1152a_dst-jpg_s206x206_tt6&_nc_cat=110&ccb=1-7&_nc_sid=50ad20&_nc_ohc=mk2oU6CHkxkQ7kNvgGs3wlC&_nc_zt=23&_nc_ht=scontent.fsgn2-6.fna&_nc_gid=AG5qvmvxd0s3ixTC_jqU8zp&oh=00_AYDfirGILL5xN_Ci0ETj74OCK-GmrZLbPKqxH-TdV7_O_A&oe=67660540'
            />
          </Tooltip>
          <Tooltip title='marchisDev'>
            <Avatar
              alt='marchisDev'
              src='https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-6/453873606_1891452261331939_8853093242799331132_n.jpg?stp=c0.296.1152.1152a_dst-jpg_s206x206_tt6&_nc_cat=104&ccb=1-7&_nc_sid=50ad20&_nc_ohc=ACoaKCoXapoQ7kNvgFEZEt_&_nc_zt=23&_nc_ht=scontent.fsgn2-5.fna&_nc_gid=AvLWvQzhDWIVBN2iQg53Bh0&oh=00_AYBSNXS-9DxikqyL7dJWuKZXaoce9lrdRzgKhK_1vWxTXg&oe=6765F6DA'
            />
          </Tooltip>
          <Tooltip title='marchisDev'>
            <Avatar
              alt='marchisDev'
              src='https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/355636188_1647600245717143_6329811738775864761_n.jpg?stp=c0.296.1152.1152a_dst-jpg_s206x206_tt6&_nc_cat=106&ccb=1-7&_nc_sid=50ad20&_nc_ohc=6lMaPWizS3AQ7kNvgGeQfGK&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=AG5qvmvxd0s3ixTC_jqU8zp&oh=00_AYBU0f33x578MhJDtfksSZd_UtGPwjllTefDZHsSZNPwgw&oe=67660D02'
            />
          </Tooltip>
          <Tooltip title='marchisDev'>
            <Avatar
              alt='marchisDev'
              src='https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/301785168_1448922025584967_3052862675932587080_n.jpg?stp=c0.185.720.720a_dst-jpg_s206x206_tt6&_nc_cat=106&ccb=1-7&_nc_sid=50ad20&_nc_ohc=XDK_Jbp6y3sQ7kNvgEeqaHf&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=Aek5At6_QR9tDDZetnBqtub&oh=00_AYAlZz7s8rRxiLjLTxbBtgUfKqmTOmNC2nmoOn96aAMaXg&oe=67660B58'
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
