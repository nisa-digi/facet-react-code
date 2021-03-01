import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import NivoChart from './Chart/NivoChart';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Paper, Tooltip } from '@material-ui/core';
interface Props {
    featureType?: any
    tableTitle?: string,
    columns?: any,
    rows?: any,
    radios?: string[],
    graph?: any[], //should have array of objects {graphType, graphStyles} 
    graphConfig?: any
}
const drawerWidth = 50;
const useStyles = makeStyles((theme) => ({
    rowTitle: {
        fontSize: 14,
        fontWeight: 600,
        padding: 10,
    },
    MuiTableCell_head: {
        backgroundColor: '#f3edd2',
        borderRight: 2,
    },
    colorBox: {
        display: "inline-block",
        borderRadius: "50%",
        width: 10,
        height: 10,
        left: 0,
        top: 0,
        //marginTop: 10,
    },
    content: {
        [theme.breakpoints.up("sm")]: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`
        }
    },
    overflowX: {
        overflowX: 'scroll'
    }
}));

const DynamicTable: React.FC<Props> = ({ featureType, tableTitle, columns, rows, graphConfig, radios, graph }) => {
    const classes = useStyles();
    const [chartType, setChartType] = useState('Standard');

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setChartType(event.target.value as string);
    };



    return (
        <React.Fragment>
            <Typography style={{ backgroundColor: '#FAB75A', paddingLeft: 20, marginLeft: 10, marginRight: 10 }} variant="h6" gutterBottom component="div" >
                {tableTitle}
            </Typography>

            <Paper className="table_container">
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={true} timeout="auto" unmountOnExit>
                            <Box margin={1}>

                                <Table size="small" aria-label="purchases">
                                    <TableHead className={classes.MuiTableCell_head}>
                                        <TableRow>
                                            <TableCell>
                                                <TableRow>
                                                    <TableCell className="tableTitle"></TableCell>
                                                    {
                                                        columns?.map((col: any) => <TableCell key={col.key} style={{ width: 100 }}>{col.displayName}</TableCell>)
                                                    }
                                                </TableRow>
                                            </TableCell>
                                            <TableCell>
                                                <FormControl style={{ marginLeft: 30, minWidth: 200, }}>
                                                    <InputLabel id="demo-simple-select-label">Chart to Show</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={chartType}
                                                        onChange={handleChange}
                                                    >
                                                        {
                                                            graphConfig?.map((data: any) =>
                                                                <MenuItem key={data.chartType} value={data.chartType}>{data.chartType}</MenuItem>
                                                            )
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody >
                                        {rows.map((row: any, index: number) => (
                                            <>
                                                <TableRow key={index.toString()}>
                                                    <TableCell>
                                                        <TableRow>
                                                            <Typography variant="h6" gutterBottom component="div" className={classes.rowTitle}>
                                                                {row.rowLabel}
                                                            </Typography>
                                                        </TableRow>
                                                        {
                                                            row.histogram.trainHistogram &&
                                                            <TableRow>

                                                                <TableCell className="tableTitle">
                                                                    <div style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                        <span className={classes.colorBox} style={{ backgroundColor: '#1B83CC' }} />
                                                                        <Typography component="text">
                                                                            Train
                                                                        </Typography>
                                                                    </div>
                                                                </TableCell>


                                                                {
                                                                    columns.map((col: any, i: number) => {
                                                                        let val: string = row["train_" + columns[i].key];
                                                                        let trainData: string = '';
                                                                        if (val) {
                                                                            if (val.length > 12) {
                                                                                trainData = val.substring(0, 10) + '..';
                                                                            } else {
                                                                                trainData = val
                                                                            }
                                                                        }
                                                                        return (
                                                                            <TableCell key={col.key} style={{ width: 100, maxWidth: 100, whiteSpace: 'nowrap', overflow: 'hidden' }} component="th" scope="row">
                                                                                <Tooltip title={val}>
                                                                                    <div>
                                                                                        {trainData}
                                                                                    </div>
                                                                                </Tooltip>
                                                                            </TableCell>
                                                                        )
                                                                    })
                                                                }
                                                            </TableRow>

                                                        }

                                                        {
                                                            row.histogram.testHistogram &&
                                                            <TableRow>

                                                                <TableCell className="tableTitle">
                                                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                        <span className={classes.colorBox} style={{ backgroundColor: '#E3C514' }}></span>
                                                                        <Typography component="text">
                                                                            Test
                                                                        </Typography>
                                                                    </div>
                                                                </TableCell>


                                                                {
                                                                    columns.map((col: any, i: number) => {
                                                                        let val: string = row["test_" + columns[i].key];
                                                                        let testData: string = '';
                                                                        if (val) {
                                                                            if (val.length > 12) {
                                                                                testData = val.substring(0, 10) + '..';
                                                                            } else {
                                                                                testData = val
                                                                            }
                                                                        }
                                                                        return (

                                                                            <TableCell key={col.key} style={{ width: 100 }} component="th" scope="row">
                                                                                <Tooltip title={val}>
                                                                                    <div>
                                                                                        {testData}
                                                                                    </div>
                                                                                </Tooltip>
                                                                            </TableCell>
                                                                        )
                                                                    })
                                                                }
                                                            </TableRow>
                                                        }

                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            (graphConfig.find((data: any) => data.chartType === chartType).moduleType === 'nivo') &&
                                                            <NivoChart
                                                                featureType={featureType}
                                                                histogram={row.histogram}
                                                                groups={[]}
                                                                type={chartType}
                                                                testColor={graphConfig.find((data: any) => data.chartType === chartType).style.trainColor}
                                                                trainColor={graphConfig.find((data: any) => data.chartType === chartType).style.testColor}
                                                            />
                                                        }

                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </Paper>
        </React.Fragment >
    )
}

export default React.memo(DynamicTable);