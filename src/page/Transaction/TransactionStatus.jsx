import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

const TransactionStatus = React.forwardRef((props, ref) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { status } = props;

    React.useImperativeHandle(ref, () => ({ handleOpen, handleClose }));

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                { status && <CheckCircleIcon color="success" sx={{ fontSize:'8rem' }}></CheckCircleIcon> }
                { !status && <CancelIcon color="error" sx={{ fontSize:'8rem' }}></CancelIcon> }
                
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {status ? 'Success' : 'Fail'}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {status ? 'Trasaction successfully added' : 'Trasaction failed'}
                </Typography>
            </Box>
        </Modal>
    );
});

export default TransactionStatus;
