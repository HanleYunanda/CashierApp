import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
    Box,
    Avatar,
    Stack
} from '@mui/material';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function UploadImage({ onFileSelect, imagePath }) {
    
    const [pickedImg, setPickedImg] = React.useState(null);
    console.log(imagePath)
    console.log(pickedImg)

    const handleUpload = (e) => {
        const uploadedFile = e.target.files[0];
        const fileReader = new FileReader();
        
        fileReader.onload = () => {
            setPickedImg(fileReader.result);
            onFileSelect(uploadedFile);
        };

        if(!uploadedFile) {
            setPickedImg(null);
        } else {
            fileReader.readAsDataURL(uploadedFile);
        }


    }

    return (
        <Stack direction='row'>
            <Box sx={{ mr: 1 }}>
                {
                    pickedImg
                    ?
                    <Avatar variant="rounded" src={pickedImg ? pickedImg : null} sx={{ width: 150, height: 150 }}>
                        Image
                    </Avatar>
                    :
                    <Avatar variant="rounded" src={'http://localhost:3500/' + imagePath} sx={{ width: 150, height: 150 }}>
                        Image
                    </Avatar>
                }
                
            </Box>
            <Box sx={{ ml: 1, alignContent:'center' }}>
                <Button
                    component="label"
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    Upload images
                    <VisuallyHiddenInput
                        type="file"
                        onChange={(e) => handleUpload(e)}
                        multiple
                    />
                </Button>
            </Box>
        </Stack>
    );
}
