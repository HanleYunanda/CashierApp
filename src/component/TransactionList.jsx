import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useSelector } from 'react-redux';

export default function TransactionList() {
    const transactions = useSelector((state) => state.transaction.items);

    return (
    <List sx={{
        width: '100%',
        overflow: 'auto',
        maxHeight: 350,
    }}>
        {transactions.map((transaction) => (
            <>
                <ListItem alignItems="center">
                    <ListItemText
                        primary={transaction.name}
                        secondary={
                        <React.Fragment>
                            <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: 'text.primary', display: 'inline' }}
                            >
                                {transaction.pricePerUnit} x {transaction.quantity}
                            </Typography>
                        </React.Fragment>
                        }
                    />
                    <ListItemText
                        primary={transaction.pricePerUnit * transaction.quantity}
                        sx={{ textAlign: 'right' }}
                    />
                </ListItem>
                <Divider component="li" />
            </>
        ))}
        
        
    </List>
    );
}