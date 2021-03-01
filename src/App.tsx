import React, { Fragment, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { datasets } from './Services/data.json';
import { NUMERIC_FEATURES, PERCENTAGES, QUANTILES, STANDARD, EXPAND, COUNT, MISSING, MEAN, STD_DEV, ZEROS, MIN, MEDIAN, MAX } from './Constants';
import { onLoadData, onGetConfigData } from './Services';
import DynamicTable from './Components/DynamicTable';
import { makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import DynamicDataLoader from './Components/DynamicDataLoader';
import CategoricalFeatures from './Screens/CategoricalFeatures';
import { AccessAlarm, ThreeDRotation, FormatListNumberedRtlOutlined, TextFormatOutlined, Check } from '@material-ui/icons';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import { Button, CardContent, CircularProgress, Container, Grid, Hidden, Paper, TextField } from '@material-ui/core';
import Banner1 from './Assets/images/banner3.png';
import Snackbar from '@material-ui/core/Snackbar';
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FAB75A",
    },
    secondary: {
      main: '#FAB75A',
    },
  },
});

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    minHeight: "auto",
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },

  tabs: {
    borderRight: `1px solid ${theme.palette.warning.dark}`,
  },

  tab_header: {
    flex: 1,
    color: '#ebebeb',
    fontSize: '1.6vh',
    flexDirection: 'row',
    textTransform: 'none',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  iconLabelWrapper: {
    flexDirection: 'row',

  },
  tabIndicator: {
    flexGrow: 1,
    marginLeft: '8%',
    marginRight: '8%',
    marginTop: 100
  },
  bannerContainer: {
    backgroundColor: '#FAB75A',
  },
  firstSection: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  UploadContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    marginLeft: '15%',
    marginRight: '15%',
  },
  uploadContent: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    width: '100%',
    paddingTop: 40,
    justifyContent: 'center'
  },
  LoadingScreen: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: window.innerHeight
  }
}, { index: 1 });

/* Consider this is 1t tab view */
function App() {
  //read config here
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [uploadedJson, setUploadedJson] = React.useState(null);
  const [oldJson, setOldJson] = React.useState(null);
  const [generate, setGenerate] = React.useState<boolean>(false)
  const inputRef: any = useRef(null);
  const [config, setConfig] = React.useState<any>(null);
  const [showToast, setShowToast] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const onChange = (event: any) => {
    setGenerate(false);
    setOldJson(uploadedJson);
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = (e: any) => {
      setUploadedJson(e.target.result);
    };
  }

  const onGenerate = () => {
    setGenerate(true);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }

  const onClear = () => {
    setTimeout(() => {
      inputRef.current.value = "";
      setGenerate(false);
      setUploadedJson(null);
      setOldJson(null);
    }, 100);
  }

  const onLoadConfig = async () => {

    await fetch("./Configs.json")
      .then(
        function (res) {
          return res.json()
        }).then(function (data) {
          // const { numericConfig, stringConfig, booleanConfig } = data;
          setConfig(data)
          console.log('Config Data: ', config)

        }).catch(
          function (err) {
            console.log(err, ' error')
          }
        )
  }

  useEffect(() => {
    onLoadConfig();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {
        !config ?
          <div className={classes.LoadingScreen}>
            <CircularProgress />
          </div>
          :
          <div style={{ flexGrow: 1 }}>
            <div className="example-card-container mb-4-spacing">
              <div className="container" style={{ backgroundColor: '#FAB75A' }}>
                <Grid container spacing={7} alignItems="center" justify="space-between">
                  <Grid item xs={12} sm={12} md={6} lg={6} alignItems="center" justify="flex-start">
                    <Container maxWidth='sm'>
                      <Typography variant="h4" component="h3">
                        FACETS - KNOW YOUR DATA
                </Typography>
                      <div>
                        <Typography style={{ marginTop: 10 }} color={"textSecondary"} variant="body1" gutterBottom>
                          The power of machine learning comes from its ability to learn patterns from large amounts of data. Understanding your data is critical to building a powerful machine learning system.
                   </Typography>

                        <Typography style={{ marginTop: 10 }} color={"textSecondary"} variant="body1" gutterBottom>
                          Facets contains two robust visualizations to aid in understanding and analyzing machine learning datasets. Get a sense of the shape of each feature of your dataset using Facets Overview, or explore individual observations using Facets Dive.
                  </Typography>
                      </div>
                    </Container>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} alignItems="center" justify="center">
                    <Container maxWidth='sm'>
                      <img
                        src={Banner1}
                        width={'80%'}
                        height={'auto'}
                      />
                    </Container>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div className="example-card-container p-10 mb-10-spacing">
              <div className="container" style={{ backgroundColor: '#F4F4F4', paddingTop: 80, paddingBottom: 80 }}>
                <Grid container spacing={7} alignItems="center" >
                  <Grid item xs={12} sm={12} md={6} lg={6} alignItems="center" justify="flex-start">
                    <Container maxWidth='sm'>
                      <Typography variant="h4" component="h3">
                        FACETS OVERVIEW
                </Typography>
                      <Typography color={"textSecondary"} style={{ marginTop: 20 }} variant="h5" component="h3">
                        Overview takes input feature data from any number of datasets, analyzes them feature by feature and visualizes the analysis.
                </Typography>
                    </Container>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} alignItems="center" justify="flex-start">
                    <Container maxWidth='sm'>
                      <Typography style={{ marginTop: 10 }} color={"textSecondary"} variant="body1" gutterBottom>
                        Overview gives users a quick understanding of the distribution of values across the features of their dataset(s). Uncover several uncommon and common issues such as unexpected feature values, missing feature values for a large number of observation, training/serving skew and train/test/validation set skew.
                </Typography>
                    </Container>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div className="example-card-container p-10 mb-5-spacing">
              <div className="container" style={{ backgroundColor: '#FFFFFF' }}>
                <div className={classes.uploadContent} id="uploadGroup">
                  <TextField inputRef={inputRef} onChange={onChange} accessKey="application/json" type='file' id="outlined-basic" variant="outlined" />
                  <Button id="buttonGroup" style={{ marginLeft: 30 }} onClick={onGenerate} disabled={uploadedJson ? false : true} variant="contained" color="primary" >
                    Generate Facets Overview
            </Button>
                  <Button id="buttonGroup" style={{ marginLeft: 30 }} onClick={onClear} disabled={generate ? false : true} variant="contained" color="inherit" >
                    Clear
            </Button>
                </div>
              </div>
            </div>
            <Paper className={classes.tabIndicator}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="Horizontal tabs example"
                className={classes.tabs}
                style={{ backgroundColor: '#141e28', width: "100%", borderRadius: 10, justifyContent: 'space-between' }}
                indicatorColor="primary"
                textColor="secondary"
                centered
              >
                <Tab label="Numeric Features" classes={{ wrapper: classes.iconLabelWrapper }}
                  icon={<FormatListNumberedRtlOutlined style={{ marginRight: 10 }} />} {...a11yProps(0)} className={classes.tab_header}
                />

                <Tab label="Categorical Features" classes={{ wrapper: classes.iconLabelWrapper }}
                  icon={<TextFormatOutlined style={{ marginRight: 10 }} />} {...a11yProps(1)} className={classes.tab_header}
                />
                <Tab label="Boolean Features" classes={{ wrapper: classes.iconLabelWrapper }}
                  icon={<Check style={{ marginRight: 10 }} />} {...a11yProps(2)} className={classes.tab_header}
                />
              </Tabs>
            </Paper>
            <div className={classes.root}>
              <TabPanel value={value} index={0}>
                <Container maxWidth="lg">
                  <DynamicDataLoader featureType={'NUMERIC'} uploadedJson={generate ? uploadedJson : oldJson} configData={config.numericConfig} />
                </Container>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Container maxWidth="lg">
                  <DynamicDataLoader featureType={'STRING'} uploadedJson={generate ? uploadedJson : oldJson} configData={config.stringConfig} />
                </Container>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Container maxWidth="lg">
                  In development
                </Container>
              </TabPanel>

            </div>
            <Snackbar
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              autoHideDuration={3000}
              open={uploadedJson ? showToast : false}
              message="Facet Overview generated successfully"
              key={1}
            />
          </div>
      }

    </ThemeProvider >
  );
}


export default App;
