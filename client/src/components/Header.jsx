import { Box } from '@mui/material'
import React from 'react'

const Header = (props) => {
    return (
        <Box sx={{
            zIndex: 2,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '1px solid #2c2c2c',
            padding: 2
        }}>
            {props.children}
        </Box>
    )
}

export default Header;