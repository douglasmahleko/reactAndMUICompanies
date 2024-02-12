import { Box, Button, FormControlLabel, IconButton, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { CheckBox } from "@mui/icons-material";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import TablePagination from '@mui/material/TablePagination';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';

function Company(){
    const columns = [
        { id:'id', name : "Id" },
        { id:'name', name : "Name" },
        { id:'email', name : "Email" },
        { id:'phone', name : "Phone" },
        { id:'address', name : "Address" },
        { id:'type', name : "Company Type" },
        { id:'action', name : "Action" },
    ]
    const [data, setdata] = useState([])
    const [id, setId] = useState(0)
    const [open, setOpen] = useState(false)
    const [agree, setAgree] = useState(true)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [type, setType] = useState('ltd')
    const history = useHistory()
    const [rowsPerpage, setRowsPerpage] = useState(5)
    const [page, setPage] = useState(0)

    const [isEdit, setIsEdit] = useState(false)
    const [title, setTitle] = useState("Create Company")
    function add(){
        setIsEdit(false)
        setTitle("Create Company")
        openUp()
    }
    const handlePageChange = (e, newpage) => {
        setPage(newpage)
    }
    const handleRowChange = (e) => {
        setRowsPerpage(+e.target.value)
        setPage(0)
    }
    const closeUp = () => {
        setOpen(false)
    }
    const openUp = () => {
        setOpen(true)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const obj = {id, name, email, phone, address, type}
        if(isEdit){
            const obj = {id, name, email, phone, address, type}
            fetch(`http://localhost:8080/company/?id=${id}`, {
            method : "POST",
            headers:{ "Content-type":"application/json"},
            body:JSON.stringify(obj)
        }).then(() => history.push('/'))
        }
        else{
            setId(id++)
            fetch("http://localhost:8080/company", {
            method : "UPDATE",
            headers:{ "Content-type":"application/json"},
            body:JSON.stringify(obj)
        }).then(() => history.push('/'))
        }   
    }
    useEffect(() => {
        fetch("http://localhost:8080/company")
        .then(res => res.json())
        .then(data => setdata(data))
    }, [])
    const handleDelete = async (email) => {
        await fetch('http://localhost:8080/notes/'+email, {
            method:'DELETE'
        })
        const newNotes = data.filter(note => note.email != email)
        setdata(newNotes)
    }
    const handleEdit = async (id) => {
        console.log(id)
        setIsEdit(true)
        setTitle("Update Company")
        setOpen(true)
        await fetch(`http://localhost:8080/company/?id=${id}`)
        .then(res => res.json())
        .then(data => {
            setType(data[0].id)
            setName(data[0].name)
            setEmail(data[0].email)
            setPhone(data[0].phone)
            setAddress(data[0].address)
            setType(data[0].type)
    })
    }
    return(
       <Box>
            <Paper sx={{margin:'1%'}} >
                <div>
                    <Button onClick={add} variant="contained">
                        Add New (+)
                    </Button>
                </div>
                <div style={{ margin: '1%' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor:'midnightblue' }} >
                                    {
                                        columns.map((col) => (
                                            <TableCell key={col.id} style={{ color:'white' }} > {col.name} </TableCell>
                                        ))
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.slice(page*rowsPerpage, page * rowsPerpage + rowsPerpage).map((company) => (
                                        <TableRow key={company.address}>
                                            <TableCell >
                                                {company.id}
                                            </TableCell>
                                            <TableCell >
                                                {company.name}
                                            </TableCell>
                                            <TableCell >
                                                {company.email}
                                            </TableCell>
                                            <TableCell >
                                                {company.phone}
                                            </TableCell>
                                            <TableCell >
                                                {company.address}
                                            </TableCell>
                                            <TableCell >
                                                {company.type}
                                            </TableCell>
                                            <TableCell >
                                                <Button variant="contained" color="primary" onClick={() => handleEdit(company.id)} >Edit</Button>
                                                <Button variant="contained" color="error" onClick={() => handleDelete(company.email)} >Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination 
                        rowsPerPageOptions={[5, 10, 20]}
                        rowsPerPage={rowsPerpage}
                        page={page}
                        count={data.length}
                        component={"div"}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowChange}
                    >

                    </TablePagination>
                </div>
            </Paper>
            <Dialog open={open} onClose={closeUp} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Typography variant="span">
                        {title}
                    </Typography>
                    <Tooltip title='close'>
                        <IconButton onClick={closeUp} style={{float:'right'}}>
                            <CloseIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                </DialogTitle>
                <DialogContent>
                    <form style={{ margin: '1%' }} onSubmit={handleSubmit}>
                        <Stack>
                            <TextField sx={{margin:'1%'}} required error={name.length===0} variant="outlined" value={name} onChange={(e) => setName(e.target.value)} label="Name" />
                            <TextField sx={{margin:'1%'}} required error={email.length===0} variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} label="Email" />
                            <TextField sx={{margin:'1%'}} required error={phone.length===0} variant="outlined" value={phone} onChange={(e) => setPhone(e.target.value)} label="Phone" />
                            <TextField sx={{margin:'1%'}} required error={address.length===0} minRows={2} maxRows={2} multiline variant="outlined" value={address} onChange={(e) => setAddress(e.target.value)} label="Address" />
                            <RadioGroup value={type} onChange={(e) => setType(e.target.value)} row sx={{margin:'1%'}} >
                                    <FormControlLabel value="mnc" control={<Radio color="success" />} label="MNC" />
                                    <FormControlLabel value="domestic" control={<Radio />} label="DOMESTIC" />
                            </RadioGroup>
                            <FormControlLabel sx={{margin:'1%'}} checked={agree} onChange={(e) => setAgree(false)} value="domestic" control={<CheckBox checked={agree} />} label="Agree Terms & Condition"></FormControlLabel>
                            <Button disabled={!agree} sx={{margin:'1%'}} variant="contained" type="submit"> Submit </Button>
                        </Stack>
                    </form>
                </DialogContent>
            </Dialog>
       </Box>
    )
}

export default Company