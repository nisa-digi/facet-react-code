import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Paper } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { getPageCount } from '@material-ui/data-grid';


interface Props {
    featureType: string,
    trainDataSet: any,
    testDataSet: any,
    groups: string[],
    width: number,
    height: number,
    testColor: string,
    trainColor: string,
    expand: boolean
}

const BarChart: React.FC<Props> = ({ featureType, trainDataSet, testDataSet, groups, width, height, testColor, trainColor, expand }) => {


    const [loading, setLoading] = React.useState<boolean>(true);
    const [data, setData] = React.useState<any[]>([]);
    const [error, setError] = React.useState<boolean>(false);
    const [pagination, setPagination] = React.useState(0);
    const [totalPage, setTotalPage] = React.useState(1);

    const numericFilter = (value: any) => {
        let newValue: any = Number(value);
        if (isNaN(newValue)) {
            if (value === undefined) {
                return 0;
            }
            else {
                return value;
            }
        }
        else {
            if (newValue > 999 && newValue < 1000000) {
                newValue = (newValue / 1000).toFixed(1) + 'K';
            } else if (newValue > 1000000) {
                newValue = (newValue / 1000000).toFixed(1) + 'M';
            }
            else {
                newValue = newValue.toFixed(2);
            }
            return newValue
        }
    }


    const generateLabel = (trainDataObject: any, testDataObject: any) => {

        let trainLowValue: any;
        let trainHighValue: any;
        let testLowValue: any;
        let testHighValue: any;
        let min: any;
        let max: any
        let label: any;

        if (trainDataObject && testDataObject) {
            trainLowValue = trainDataObject.low_value;
            trainHighValue = trainDataObject.high_value;
            testLowValue = testDataObject.low_value;
            testHighValue = testDataObject.high_value;
            min = (trainLowValue <= testLowValue) ? trainLowValue : testLowValue;
            max = (trainHighValue >= testHighValue) ? trainHighValue : testHighValue;
        }
        else if (trainDataObject) {
            trainLowValue = trainDataObject.low_value;
            trainHighValue = trainDataObject.high_value;
            min = trainLowValue;
            max = trainHighValue;
        }
        else if (testDataObject) {
            testLowValue = testDataObject.low_value;
            testHighValue = testDataObject.high_value;
            min = testLowValue;
            max = testHighValue;
        }

        label = `${numericFilter(min)}-${numericFilter(max)}`
        return label;
    }



    const onNormalizeGraphData = () => {
        const loopDataSet = trainDataSet ? trainDataSet : testDataSet;
        try {
            let chart: any[] = [];

            for (let i = 0; i < loopDataSet.length; i++) {
                let singleObject: any = {};
                let trainCount: any;
                let testCount: any;

                const setTrainData = (lbl: any) => {

                    trainCount = trainDataSet[i].sample_count;
                    singleObject = { ...singleObject, label: lbl, train: trainCount };
                }

                const setTestData = (lbl: any) => {
                    testCount = testDataSet[i].sample_count;
                    singleObject = { ...singleObject, label: lbl, test: testCount };
                }

                if (trainDataSet && testDataSet) {

                    let label = (featureType === 'STRING') ? trainDataSet[i].label : generateLabel(trainDataSet[i], testDataSet[i]);
                    setTrainData(label);
                    setTestData(label);
                }
                else if (trainDataSet) {
                    let label = (featureType === 'STRING') ? trainDataSet[i].label : generateLabel(trainDataSet[i], null);
                    setTrainData(label);
                }
                else if (testDataSet) {
                    let label = (featureType === 'STRING') ? testDataSet[i].label : generateLabel(null, testDataSet[i]);
                    setTestData(label);
                }

                chart.push(singleObject);
            }
            setData(chart);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(true);
        }
    }

    React.useEffect(() => {
        onNormalizeGraphData();
        getPageCount();
    }, []);


    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        let actualPages: number = value - 1;
        let datacount: number = actualPages * 15;
        setPagination(datacount);
    };

    const getPageCount = () => {
        var dataLength: number = Math.floor(data.length / 15);
        var reminder: number = data.length % 15;
        if (reminder > 0) {
            dataLength = dataLength + 1;
        } else {
            dataLength = dataLength;
        }
        return dataLength;
    }


    const getKeys = () => {
        if (trainDataSet && testDataSet) {
            return ['train', 'test'];
        }
        else if (trainDataSet) {
            return ['train'];
        }
        else if (testDataSet) {
            return ['test'];
        }
    }

    const getColors = () => {
        if (trainDataSet && testDataSet) {
            return [trainColor, testColor];
        }
        else if (trainDataSet) {
            return [trainColor];
        }
        else if (testDataSet) {
            return [testColor];
        }
    }

    return (
        <>
            <div style={{ width: width, height: height, backgroundColor: '#fff' }}>
                {
                    (loading) ?
                        <CircularProgress disableShrink />
                        :
                        (error) ?
                            <h4>Invalid data to visualize</h4>
                            :
                            <ResponsiveBar
                                data={expand ? data.slice(0 + pagination, 15 + pagination) : data.slice(0, 10)}
                                keys={getKeys()}
                                indexBy="label"
                                margin={{ top: 10, right: 80, bottom: expand ? 160 : 70, left: 10 }}
                                padding={0.5}
                                groupMode={'grouped'}
                                //valueScale={{ type: 'linear' }}
                                //indexScale={{ type: 'band', round: false }}
                                colors={getColors()}
                                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    orient: "bottom",
                                    tickSize: 0,
                                    tickPadding: 10,
                                    tickRotation: -90,
                                    format: function (value) {
                                        var label = value.toString();
                                        var sub = label.substring(0, 5);
                                        if (expand) {
                                            return label;
                                        } else {
                                            return sub + '...';
                                        }

                                    }

                                }}
                                axisLeft={null}
                                enableLabel={false}
                                labelSkipWidth={12}
                                labelSkipHeight={12}
                                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                legends={[
                                    {
                                        dataFrom: 'keys',
                                        anchor: 'bottom-right',
                                        direction: 'column',
                                        justify: false,
                                        translateX: 120,
                                        translateY: 0,
                                        itemsSpacing: 2,
                                        itemWidth: 100,
                                        itemHeight: 20,
                                        itemDirection: 'left-to-right',
                                        itemOpacity: 0.85,
                                        symbolSize: 20,
                                        effects: [
                                            {
                                                on: 'hover',
                                                style: {
                                                    itemOpacity: 1
                                                }
                                            }
                                        ]
                                    }
                                ]}
                                animate={true}
                                motionStiffness={90}
                                motionDamping={15}
                            />
                }

            </div>
            {
                data.length > 10 && expand === false &&
                <div style={{ paddingBottom: 20, fontSize: 12 }}>
                    Click to view full graph
                </div>
            }
            {
                data.length > 25 && expand === true &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: 10, backgroundColor: '#fff' }}>
                    <Pagination count={getPageCount()} onChange={handleChange} />
                </div>
            }
        </>
    )
}

export default React.memo(BarChart)