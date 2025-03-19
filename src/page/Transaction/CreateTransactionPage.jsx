import {
    Card,
    CardHeader,
    CardContent,
    Stack,
    Container,
    InputLabel,
    Input,
    Box,
    Typography,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    CardActions,
    Button
} from "@mui/material";
import TransactionList from "../../component/TransactionList";
import TransactionStatus from "./TransactionStatus";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import moment from 'moment';

function CreateTransactionPage() {

    const paymentRef = useRef();
    const modalStatus = useRef();
    const [isCash, setIsCash] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState(false);

    const token = useSelector((state) => state.auth.token);

    const cashier = useSelector((state) => state.auth);
    const [customerName, setCustomerName] = useState('');
    const today = moment().format('DD-MM-YYYY');
    const [cashPayment, setCashPayment] = useState({
        cash: 0,
        change: 0
    });
    const transaction = useSelector((state) => state.transaction);

    function handlePaymentMethodChange() {
        if(paymentRef.current.querySelector('input:checked')?.value == 'CASH') {
            setIsCash(() => true);
        } else {
            setIsCash(() => false);
        }
    }

    function handleCashChange(event) {
        const cashValue = event.target.value;
        const changeValue = parseInt(cashValue, 10) - parseInt(transaction.totalPrice, 10)
        if(changeValue > 0) {
            setCashPayment(() => {
                return {
                    cash: cashValue,
                    change: changeValue
                }
            });
        } else {
            setCashPayment(() => {
                return {
                    cash: cashValue,
                    change: 0
                }
            });
        }

    }

    async function handleSubmit(e){
        e.preventDefault();
        const data = {
            customer: customerName,
            cashier: cashier.id,
            transactionDate: moment().format('YYYY-MM-DD'),
            paymentMethod: isCash ? 'CASH' : 'QR',
            cash: cashPayment.cash,
            change: cashPayment.change,
            totalPrice: transaction.totalPrice,
            transactionDetails: transaction.items
        };
        console.log(data);

        const response = await fetch('http://localhost:3500/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                totalPrice: transaction.totalPrice,
                createdBy: cashier.id,
                transactionDetails: transaction.items
            })
        });

        if(response.status == 201) {
            setTransactionStatus(true);
        }else {
            setTransactionStatus(false);
        }
        
        console.log(await response.json())
        modalStatus.current.handleOpen();
    }

    let cashForm = null;
    if(isCash) {
        cashForm = (
            <>
                <Stack direction='row' sx={{ mb: 1 }} justifyContent='space-between'>
                    <Box sx={{ width:'100%', paddingRight: 1 }}>
                        <InputLabel htmlFor="cash">Cash</InputLabel>
                        <Input id="cash" fullWidth variant='outline' onChange={handleCashChange} value={cashPayment.cash} />
                    </Box>
                    <Box sx={{ width:'100%', paddingLeft: 1 }}>
                        <InputLabel htmlFor="change">Change</InputLabel>
                        <Input id="change" fullWidth variant='outline' readOnly value={cashPayment.change} />
                    </Box>
                </Stack>
            </>
        );
    }


    return (
        <Container sx={{
            my: 3,
        }}>

            {/* Modal for Transaction Status */}
            <TransactionStatus ref={modalStatus} status={transactionStatus}></TransactionStatus>

            <form onSubmit={handleSubmit} id="transactionForm">
                <Card>
                    <CardHeader
                        title="Transaction"
                    />
                    <CardContent>
                        <Stack direction='row'>
                            <Container>
                                <TransactionList />
                            </Container>
                            <Container>
                                    <Box sx={{ mb: 1 }}>
                                        <InputLabel htmlFor="customerName">Customer Name</InputLabel>
                                        <Input id="customerName" fullWidth variant='outline' value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                                    </Box>
                                    <Box sx={{ mb: 1 }}>
                                        <InputLabel htmlFor="transactionDate">Transaction Date</InputLabel>
                                        <Input id="transactionDate" fullWidth variant='outline' value={today} />
                                    </Box>
                                    <Box sx={{ mb: 1 }}>
                                        <InputLabel htmlFor="cashier">Cashier</InputLabel>
                                        <Input id="cashier" fullWidth variant='outline' value={cashier.email} readOnly />
                                    </Box>
                                    <Box sx={{ mb: 1 }}>
                                        <FormControl>
                                            <FormLabel id="paymentMethod">Payment Method</FormLabel>
                                            <RadioGroup
                                                row
                                                aria-labelledby="paymentMethod"
                                                name="paymentMethod"
                                                ref={paymentRef}
                                                onChange={handlePaymentMethodChange}
                                            >
                                                <FormControlLabel value="CASH" control={<Radio />} label="Cash" />
                                                <FormControlLabel value="QR" control={<Radio />} label="QR" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Box>
                                    {cashForm}
                                    <Stack direction="row" justifyContent="space-between" sx={{mt: 5 }}>
                                        <Typography variant="body1" color="initial">
                                            Total :
                                        </Typography>
                                        <Typography variant="body1" color="initial">
                                            Rp {transaction.totalPrice}
                                        </Typography>
                                    </Stack>
                            </Container>
                        </Stack>
                    </CardContent>
                    <CardActions sx={{
                        justifyContent:'end'
                    }}>
                        <Button type="submit">
                            Submit
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </Container>
    )
}

export default CreateTransactionPage;