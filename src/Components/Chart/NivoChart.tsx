import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { datasets } from '../../Services/sampleData.json';
import { ResponsiveSwarmPlot } from '@nivo/swarmplot';
import BarChart from './Nivo/BarChart';
import { QuantileChart } from './Nivo/QuantileChart'
import Modal from '@material-ui/core/Modal';


interface Props {
    featureType: string,
    type: string,
    histogram: any,
    groups: string[],
    testColor: string,
    trainColor: string
}



const NivoChart: React.FC<Props> = ({ featureType, histogram, type, groups, testColor, trainColor }) => {

    const [open, setOpen] = React.useState(false);
    const [modalType, setModalType] = React.useState(type);

    const handleOpen = (type: string) => {
        setModalType(type)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



    function SwitchChart() {

        switch (type) {
            case 'Standard':
                return (
                    <button style={{ backgroundColor: '#fff', borderWidth: 0, outline: 'none', cursor: 'pointer' }} type="button" onClick={() => handleOpen(type)}>
                        <BarChart
                            featureType={featureType}
                            trainDataSet={histogram.trainHistogram && histogram.trainHistogram[0].buckets}
                            testDataSet={histogram.testHistogram && histogram.testHistogram[0].buckets}
                            groups={groups}
                            testColor={testColor}
                            trainColor={trainColor}
                            expand={false}
                            width={350}
                            height={180} />
                    </button>
                )
            case 'Quantiles':
                return (
                    <button style={{ backgroundColor: '#fff', borderWidth: 0, outline: 'none', cursor: 'pointer' }} type="button" onClick={() => handleOpen(type)}>
                        <QuantileChart
                            trainDataSet={histogram.trainHistogram && histogram.trainHistogram[1].buckets}
                            testDataSet={histogram.testHistogram && histogram.testHistogram[1].buckets}
                            groups={groups}
                            testColor={testColor}
                            trainColor={trainColor}

                            width={400}
                            height={130} />
                    </button>
                )
            default:
                return (
                    <button style={{ backgroundColor: '#fff', borderWidth: 0, outline: 'none', cursor: 'pointer' }} type="button" onClick={() => handleOpen(type)}>
                        <BarChart
                            featureType={featureType}
                            trainDataSet={histogram.trainHistogram && histogram.trainHistogram[0].buckets}
                            testDataSet={histogram.testHistogram && histogram.testHistogram[0].buckets}
                            groups={groups}
                            testColor={testColor}
                            trainColor={trainColor}
                            expand={false}
                            width={400}
                            height={180} />
                    </button>
                )
        }
    }

    return (
        <div>

            {/* {SwitchChart()} */}
            <SwitchChart />

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#fff', width: '100%', justifyContent: 'flex-end' }}>
                        <button style={{ alignSelf: 'flex-end' }} onClick={handleClose}> X </button>
                    </div>
                    {
                        modalType === 'Standard' ?
                            (
                                <BarChart
                                    featureType={featureType}
                                    trainDataSet={histogram.trainHistogram && histogram.trainHistogram[0].buckets}
                                    testDataSet={histogram.testHistogram && histogram.testHistogram[0].buckets}
                                    groups={groups}
                                    testColor={testColor}
                                    trainColor={trainColor}
                                    expand={true}
                                    width={window.innerWidth * 0.75}
                                    height={window.innerHeight * 0.75}
                                />
                            ) : (
                                <QuantileChart
                                    trainDataSet={histogram.trainHistogram && histogram.trainHistogram[1].buckets}
                                    testDataSet={histogram.testHistogram && histogram.testHistogram[1].buckets}
                                    groups={groups}
                                    testColor={testColor}
                                    trainColor={trainColor}
                                    width={window.innerWidth * 0.75}
                                    height={window.innerHeight * 0.75}
                                />
                            )
                    }
                </div>
            </Modal>

        </div>
    );
}

export default React.memo(NivoChart);

