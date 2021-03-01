import React from 'react'
import { datasets } from '../../../Services/SampleData2.json';
import { ResponsiveSwarmPlot } from '@nivo/swarmplot';
import CircularProgress from '@material-ui/core/CircularProgress';

interface Props {
    trainDataSet: any,
    testDataSet: any,
    groups: string[],
    width: number,
    height: number,
    testColor: string,
    trainColor: string
}

export const QuantileChart: React.FC<Props> = ({ trainDataSet, testDataSet, groups, width, height, testColor, trainColor }) => {



    const [loading, setLoading] = React.useState<boolean>(true);
    const [data, setData] = React.useState<any>({});
    const [error, setError] = React.useState<boolean>(false);
    const [group, setGroup] = React.useState<string[]>([]);

    // console.log('tr:', trainDataSet);
    const loopDataSet = trainDataSet ? trainDataSet : testDataSet;
    const onNormalizeData = () => {
        try {
            let quantileCharts: any[] = [];
            for (let i = 0; i < loopDataSet.length; i++) {

                let trainObject: any;
                let testObject: any;

                const setTrainData = () => {
                    trainObject = { id: `0.${i}`, group: 'train', count: trainDataSet[i].low_value };
                }
                const setTestData = () => {
                    testObject = { id: `1.${i}`, group: 'test', count: testDataSet[i].low_value };
                }
                if (trainDataSet && testDataSet) {
                    setTrainData();
                    setTestData();
                    quantileCharts.push(trainObject);
                    quantileCharts.push(testObject);
                }
                else if (trainDataSet) {
                    setTrainData();
                    quantileCharts.push(trainObject);
                }
                else if (testDataSet) {
                    setTestData();
                    quantileCharts.push(testObject);
                }
            }

            let finalObject: any = {};
            let trainlowValue: any = 0;
            let testLowValue: any = 0;
            let trainHighValue: any = 0;
            let testHighValue: any = 0;

            const setTrainData = () => {
                trainlowValue = trainDataSet[0].low_value;
                trainHighValue = trainDataSet[trainDataSet.length - 1].high_value;
            }

            const setTestData = () => {
                testLowValue = testDataSet[0].low_value;
                testHighValue = testDataSet[testDataSet.length - 1].high_value;
            }

            if (trainDataSet && testDataSet) {
                setTrainData();
                setTestData();
                let min = (trainlowValue <= testLowValue) ? trainlowValue : testLowValue;
                let max = (trainHighValue >= testHighValue) ? trainHighValue : testHighValue;
                let maxTrainObject = { id: `0.${quantileCharts.length}`, group: 'train', count: trainHighValue };
                let maxTestObject = { id: `1.${quantileCharts.length}`, group: 'test', count: testHighValue };
                quantileCharts.push(maxTrainObject);
                quantileCharts.push(maxTestObject);
                setGroup(['train', 'test']);
                finalObject = { range: { min, max }, charts: quantileCharts };
                console.log('FINAL OBJECT:', finalObject);
            }
            else if (trainDataSet) {
                setTrainData();
                let min = trainlowValue;
                let max = trainHighValue;
                let maxTrainObject = { id: `0.${quantileCharts.length}`, group: 'train', count: trainHighValue };
                quantileCharts.push(maxTrainObject);
                setGroup(['train']);
                finalObject = { range: { min, max }, charts: quantileCharts };
            }
            else if (testDataSet) {
                setTestData();
                let min = testLowValue;
                let max = testHighValue;
                let maxTestObject = { id: `1.${quantileCharts.length}`, group: 'test', count: testHighValue };
                quantileCharts.push(maxTestObject);
                setGroup(['test']);
                finalObject = { range: { min, max }, charts: quantileCharts };
            }




            setLoading(false);
            setData(finalObject);
        } catch (error) {
            setLoading(false);
            setError(true);
        }
    }


    React.useEffect(() => {
        onNormalizeData();
    }, []);

    return (
        <div style={{ width: width, height: height, backgroundColor: '#fff' }}>
            {
                (loading) ?
                    <CircularProgress disableShrink />
                    :
                    (error) ?
                        <h4>Invalid data to visualize</h4>
                        :
                        <ResponsiveSwarmPlot
                            data={data.charts}
                            groups={group}
                            value="count"
                            layout="horizontal"
                            //valueFormat="1k"
                            valueScale={{ type: 'linear', min: data.range.min, max: data.range.max, reverse: false }}
                            // size={{ key: 'volume', values: [3, 5], sizes: [5, 5] }}
                            forceStrength={4}
                            simulationIterations={100}
                            colors={group[0] === 'train' ? [trainColor, testColor] : [testColor]}
                            //colors={[trainColor, testColor]}
                            borderColor={{
                                from: 'color',
                                modifiers: [
                                    [
                                        'darker',
                                        0.6
                                    ],
                                    [
                                        'opacity',
                                        0.5
                                    ]
                                ]
                            }}
                            margin={{ top: 40, right: 100, bottom: 55, left: 50 }}
                            axisBottom={{
                                orient: 'bottom',
                                tickSize: 10,
                                tickPadding: 5,
                                tickRotation: -45,
                                legendPosition: 'middle',
                                legendOffset: 46
                            }}
                            axisTop={null}
                            motionStiffness={50}
                            motionDamping={20}
                        />
            }
        </div>
    )
}