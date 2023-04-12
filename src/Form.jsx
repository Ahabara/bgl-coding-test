import React, {useState} from 'react';
import './App.css';
import {
    Box,
    Button,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    MenuItem, Paper,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    TextField
} from "@mui/material";
import * as PropTypes from "prop-types";

function Report(props) {
    return <ul>
        <li>
            Name: {props.member.name} Profit: {props.displayMembers} Tax: {props.displayTax}
        </li>
    </ul>;
}

function Fund(props) {
    return <div>
        <TextField
            id="fund-name"
            label="Fund Name"
            variant="standard"
            onChange={props.onChange}
            required/>
        <TextField
            id="income"
            label="Income"
            variant="standard"
            required
            onChange={props.income}
        />
        <TextField
            id="expense"
            label="Expense"
            variant="standard"
            required
            onChange={props.onChange2}
        />
        <TextField
            onChange={props.onChange3}
            id="tax-rate"
            select
            label="Select Tax Rate"
            helperText="Select your Tax Rate">
            {props.taxRates.map(props.callbackfn)}
        </TextField>
    </div>;
}

Fund.propTypes = {
    onChange: PropTypes.func,
    income: PropTypes.func,
    onChange2: PropTypes.func,
    onChange3: PropTypes.func,
    taxRates: PropTypes.any,
    callbackfn: PropTypes.func
};
const Form = () => {
    const taxRates = [
        {
            value: 0.10,
            label: "10%"
        },
        {
            value: 0.15,
            label: "15%"
        }
    ];
    const [fundName, setFundName] = useState();
    const [totalProportion, setTotalProportion] = useState(0);
    const [totalNonPensionProportion, setTotalNonPensionProportion] = useState(0);
    const [members, setMembers] = useState([])
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [profit, setProfit] = useState(0);
    const [afterTaxProfit, setAfterTaxProfit] = useState(0);
    const [taxRate, setTaxRate] = useState(0);
    const [memberName, setMemberName] = useState();
    const [memberProportion, setMemberProportion] = useState();
    const [pensionMode, setPensionMode] = useState(false);
    const [viewReport, setViewReport] = useState(false);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    function handleNameChange(event) {
        setMemberName(event.target.value);
    }
    function handleTaxFreeChange(event) {
        setMemberProportion(event.target.value);
    }
    const addMember = () => {
        if (memberName === "" || memberProportion === 0) {
            return alert("Please fill out all fields");
        }
        if (parseInt(memberProportion) + totalProportion > 100) {
            return alert("Proportion cannot exceed 100%");
        }
        let newMember = {name: memberName, taxProportion: memberProportion, pension:pensionMode};
        setTotalProportion(totalProportion + parseInt(memberProportion));
        setMemberName("");
        setMemberProportion("");
        setMembers([...members, newMember]);
        setTotalNonPensionProportion(calcTotalNonPensionPortion([...members, newMember]))
    };

    function displayMembers(member){
        let taxablePortion = parseInt(member.taxProportion);
        if (member.pension){
            return (profit*taxablePortion/100)
        }
        else {
            return (afterTaxProfit * (taxablePortion / totalNonPensionProportion))
        }
    }

    function displayTax(member){
        let taxablePortion = parseInt(member.taxProportion);
        let tax = incomeTaxPayable(calculateProfit(income, expense), taxRate)
        if (member.pension){
            return 0
        }
        else {
            return tax * (taxablePortion / totalNonPensionProportion)
        }
    }

    function sortList(members) {
        return [...members].sort((a, b) => (a.taxProportion > b.taxProportion) ? -1 : 1)
    }

    const SMSFReport = sortList(members).map((member, index) =>
        <Report member={member} displayMembers={displayMembers(member)} displayTax={displayTax(member)}/>
    )

    const SMSFMembers = members.map((member, index) =>
        <ListItem>
            <ListItemText primary={`Member ${++index}: ${member.name}`} secondary={`Tax Portion ${member.taxProportion}% - ${pensionMode? "Pension" : "Non-Pension"}`} />
        </ListItem>
    )

    const SMSFMemberTable = members.map((member, index) =>
            <TableRow
                key={member.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell component="th" scope="row">
                    {member.name}
                </TableCell>
                <TableCell align="right">{member.taxProportion}</TableCell>
                <TableCell align="right">{member.pension.toString()}</TableCell>
            </TableRow>
    )


    function calcTotalNonPensionPortion(members) {
        let sum = 0;
        members.forEach(member => {
            if (!member.pension) {
                sum += parseInt(member.taxProportion);
            }
        })
        return sum;
    }

    function handleIncomeChange(event) {
        setIncome(event.target.value);
        let profit = calculateProfit(event.target.value, expense);
        setProfit(profit)
        setAfterTaxProfit(calcAfterTaxProfit(profit, taxRate));
    }
    function handleExpenseChange(event) {
        setExpense(event.target.value);
        let profit = calculateProfit(income, event.target.value);
        setProfit(profit)
        setAfterTaxProfit(calcAfterTaxProfit(profit, taxRate));
    }

    const handlePensionModeChange = (event) => {
        setPensionMode(event.target.checked);
    };


    function handleTaxRateChange(e) {
        setTaxRate(e.target.value);
        let profit = calculateProfit(income, expense);
        setProfit(profit)
        setAfterTaxProfit(calcAfterTaxProfit(profit, e.target.value));
    }

    function generateInformation() {
        if (totalProportion !== 100) {
            return alert("Total proportion must equal 100%");
        }
        else {
            setViewReport(true);
        }
    }

    function handleFundNameChange(event) {
        setFundName(event.target.value);
    }

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': {m: 1, width: '25ch'},
            }}
            noValidate
            autoComplete="off"
        >
            <Fund onChange={handleFundNameChange} income={handleIncomeChange} onChange2={handleExpenseChange}
                  onChange3={handleTaxRateChange} taxRates={taxRates} callbackfn={(option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            )}/>
            {/*TODO make into component*/}
            <div>
                <form>
                    <Box sx={{display: 'inline-flex'}}>
                        <TextField id="member-name" label="Member Name" variant="standard" required value={memberName}
                                   onChange={handleNameChange}/>
                        <TextField id="proportion" label="Proportion" variant="standard" value={memberProportion}
                                   required type="number" onChange={handleTaxFreeChange}/>
                        <Checkbox onChange={handlePensionModeChange} {...label} /> <h6> Pension Mode </h6>
                        <Button variant="contained" size="small" onClick={addMember}>Add Member</Button>
                    </Box>
                </form>
            </div>
            <List>

            </List>
            <div className="table-container">
                <div className="table">
                    <TableContainer component={Paper}>
                        <Table  aria-label="simple table"
                                size={'small'}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Tax Portion</TableCell>
                                    <TableCell align="right">Pension Mode</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {SMSFMemberTable}
                            </TableBody>
                        </Table>
                        <ul>Fund Total Proportion = {totalProportion}% ({100 -totalProportion}% unallocated)</ul>
                    </TableContainer>
                </div>
            </div>

            <Button variant="contained" size="small" onClick={generateInformation}>Generate Information</Button>
            {viewReport ? SMSFReport : null}
        </Box>
    );
};

function calculateProfit(income, expense) {
    income = parseInt(income);
    expense = parseInt(expense);
    if (income > expense){
        return Math.round((income - expense));
    }
    else {
        return 0;
    }
}

function calcAfterTaxProfit(profit, taxRate) {
    return Math.round(parseInt(profit) * (1-parseFloat(taxRate)))
}
function incomeTaxPayable(profit, taxRate) {
    return Math.round(parseInt(profit) * (parseFloat(taxRate)))
}



export default Form;