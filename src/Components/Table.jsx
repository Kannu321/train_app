import React,{useState,useEffect}  from 'react';
import axios from "axios";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { visuallyHidden } from '@mui/utils';
import TableSortLabel from '@mui/material/TableSortLabel';
import _ from "lodash";


/////////////////////////////////////////////pagenation///////////////////////////
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

/////////////////////////////////////////////////Sorting///////////////////////////////////////
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  



  /////////////////////////////////////////////////Table Head////////////////////////////////////////////////////
const headCells = [
    {
      id: 'TrainId',
      label: 'Train Id',
    
    },
    {
        id: 'TrainNumber',
        label:'Train Number',
      },
      {
        id: 'CarCount',
        label: 'Car Count',
      },
      
      {
        id: 'DirectionNum',
        label: 'Direction Num',
      },
      {
        id: 'CircuitId',
        label: 'Circuit Id',
      },
      {
        id: 'DestinationStationCode',
        label: 'Destination Station Code',
      },
      {
        id: 'lineCode',
        label: 'line Code',
      },
      {
        id: 'SecondsAtLocation',
        label: 'Seconds At Location',
      },
      {
        id: 'ServiceType',
        label: 'Service Type',
      },
    
  ];


  
function EnhancedTableHead(props) {
    const {  order, orderBy,   onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
             
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  


export default function CreateTable() {

  ////////////API Call/////////////////
  const [position,setPosition] = useState([]);
  useEffect(()=> {
    getData();
    async function getData(){
      const response = await axios.get("https://api.wmata.com/TrainPositions/TrainPositions?contentType=json&api_key=4ea26ab54b3c4a6f949144fe6dc1bdb8");
      setPosition(response.data.TrainPositions);
      
  }
    const intervalId = setInterval(getData, 300000);
      
   
  return () => setTimeout(intervalId,0);
  },[]);



const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('TableId');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

//for sorting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  //for  pagenbation
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - position.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  

  return (
    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 500 ,border:2,boxShadow:1}}  >
      <EnhancedTableHead sx={{fontWeight:"bolder"}}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
             />
        <TableBody>
          {stableSort(position, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
            <TableRow
                                                                                                                                                                                                                                                                                        key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
          
                <TableCell align="left">{row.TrainId}</TableCell>
              <TableCell align="left">{row.TrainNumber}</TableCell>
              <TableCell align="left">
              {_.times(row.CarCount, (i) => (
                <DirectionsCarIcon key={i}/>
              ))}
              </TableCell>
              <TableCell align="left">{row.DirectionNum}</TableCell>
              <TableCell align="left">{row.CircuitId}</TableCell>
              <TableCell align="left">{row.DestinationStationCode}</TableCell>
              <TableCell align="left">{row.LineCode}</TableCell>
              <TableCell align="left">{row.SecondsAtLocation}</TableCell>
              <TableCell align="left">{row.ServiceType}</TableCell>
              </TableRow>
           
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow >
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={4}
              count={position.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
