import React, {useState} from 'react';
import {Box, Button, MenuItem, TextField} from "@mui/material";


function Member(props) {
    // id ={props.id}
    return <div >
        <Box sx={{ display: 'inline-flex' }} >
            <b> {props.id} </b>
            <TextField id="member-name" label="Member Name" variant="standard" required/>
            <TextField id="proportion" label="Tax Free Proportion" variant="standard" required/>
        </Box>
    </div>;
}
const Fund = () => {

    const [fundName, setFundName] = useState();
    const [membersList, setMembersList] = useState([])
    const taxRates = [
        {
            value: 0,
            label: "0%"
        },
        {
            value: 10,
            label: "10%"
        },
        {
            value: 15,
            label: "15%"
        }
    ]

    const addMember = () => {
        setMembersList(membersList.concat(<Member/>))
    };

    const memberItems = membersList.map((member) =>
        member
    );


    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': {m: 1, width: '25ch'},
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <TextField
                    id="fund-name"
                    label="Fund Name"
                    variant="standard"
                    required/>
                <TextField
                    id="income"
                    label="Income"
                    variant="standard"
                    required/>
                <TextField
                    id="expense"
                    label="Expense"
                    variant="standard"
                    required/>
                <TextField
                    id="tax-rate"
                    select
                    label="Select Tax Rate"
                    defaultValue="0"
                    helperText="Select your Tax Rate">
                    {taxRates.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            {memberItems}
            <Button variant="contained" size="small" onClick={addMember}>Add Member</Button>
        </Box>
    );
};

function profit(income, expense) {
    income = parseInt(income);
    expense = parseInt(expense);
    if (income > expense){
        return Math.round((income - expense));
    }
    else {
        // TODO loss logic
    }
}
const members = [
    {
        name: "John",
        profitAllocation: 10,
    }

]
function membersProportion(profit, proportion) {
    return Math.round((profit * proportion))
}
function membersProfitAllocation(members, profit) {
    members.forEach(member => {
        // TODO finish logic
    })
}
function membersTaxAllocation(incomeTaxPayable, membersProportion) {
    // TODO double check this
    return membersProportion * incomeTaxPayable;
}
function incomeTaxPayable(profit, taxRate) {
    return Math.round(parseInt(profit) * parseInt(taxRate))
}

export default Fund;