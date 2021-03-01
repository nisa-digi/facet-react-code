import React from 'react';
import { datasets } from './data.json'



var trainDataSet: any;
var testDataSet: any;
var configColumns: any;

//Configs.json file is reading from the public folder
export const onGetConfigData = async (type: string) => {

    let config: any;
    await fetch("./Configs.json")
        .then(
            function (res) {
                return res.json()
            }).then(function (data) {
                const { numericConfig, stringConfig, booleanConfig } = data;
                if (type === 'NUMERIC') {
                    config = numericConfig;
                }
                else if (type === 'STRING') {
                    config = stringConfig;
                }
                else if (type === 'BOOLEAN') {
                    config = booleanConfig;
                }
            }).catch(
                function (err) {
                    console.log(err, ' error')
                }
            )

    console.log('conf:', config);
    return config;
}


const numericFilter = (value: any) => {
    value = Number(value);
    if (value === NaN) {
        return value;
    }
    else {
        if (value > 999 && value < 1000000) {
            value = (value / 1000).toFixed(1) + 'K';
        } else if (value > 1000000) {
            value = (value / 1000000).toFixed(1) + 'M';
        }
        else {
            value = value.toFixed(2);
        }
        return value
    }
}

/* 
    * NOTE THAT : numNonMissing => this should be missing, so in the backend side there should be a property to take missng value.
*/


const readJson = (type: string, index: number) => {

    let singleObject: any = {};
    let rowLabel: any;
    let trainStats: any;
    let testStats: any;
    let trainHistogram: any[];
    let testHistogram: any[];
    let trainTopValues: any;
    let testTopValues: any;
    let trainCommonStats: any;
    let testCommonStats: any;
    let histogram: any;

    const setTrainData = () => {
        rowLabel = trainDataSet.features[index].name;
        singleObject = { ...singleObject, rowLabel };
        if (type === 'NUMERIC') {
            trainStats = trainDataSet.features[index].num_stats;
            trainHistogram = trainStats.histograms;
            histogram = { ...histogram, trainHistogram };
        }
        else if (type === 'STRING') {
            trainStats = trainDataSet.features[index].string_stats;
            trainHistogram = trainStats.rank_histogram;
            trainTopValues = trainStats.top_values[0];
            histogram = { ...histogram, trainHistogram: [trainHistogram] }; // Put this inside an array, because, by default in 'numeric' dataSet passed as array 
        }
        trainCommonStats = trainStats.common_stats;

    }

    const setTestData = () => {
        rowLabel = testDataSet.features[index].name;
        singleObject = { ...singleObject, rowLabel }
        if (type === 'NUMERIC') {
            testStats = testDataSet.features[index].num_stats;
            testHistogram = testStats.histograms;
            histogram = { ...histogram, testHistogram };
        }
        else if (type === 'STRING') {
            testStats = testDataSet.features[index].string_stats;
            testHistogram = testStats.rank_histogram;
            testTopValues = testStats.top_values[0];
            histogram = { ...histogram, testHistogram: [testHistogram] }; // Put this inside an array, because, by default in 'numeric' dataSet passed as array 
        }
        testCommonStats = testStats.common_stats;
    }

    const mapObjectByLabel = (col: any, dataSetLabel: string) => {
        let object: any = {};
        if (dataSetLabel === "train_") {
            if (trainDataSet[col.key]) {
                object = { ...object, [dataSetLabel + col.key]: numericFilter(trainDataSet[col.key]) };
            }
            else if (trainStats[col.key]) {
                object = { ...object, [dataSetLabel + col.key]: numericFilter(trainStats[col.key]) };
            }
            else if (trainCommonStats[col.key]) {
                object = { ...object, [dataSetLabel + col.key]: numericFilter(trainCommonStats[col.key]) };
            }

            else if (trainTopValues && trainTopValues[col.key]) {
                object = { ...object, [dataSetLabel + col.key]: trainTopValues[col.key] };
            }
        }
        else {
            if (testDataSet[col.key]) {
                object = { ...object, [dataSetLabel + col.key]: numericFilter(testDataSet[col.key]) };
            }
            else if (testStats[col.key]) {
                object = { ...object, [dataSetLabel + col.key]: numericFilter(testStats[col.key]) };
            }
            else if (testCommonStats[col.key]) {
                object = { ...object, [dataSetLabel + col.key]: numericFilter(testCommonStats[col.key]) };
            }
            else if (testTopValues && testTopValues[col.key]) {
                object = { ...object, [dataSetLabel + col.key]: testTopValues[col.key] };
            }
        }
        return object;
    }

    if (trainDataSet && testDataSet) {
        setTrainData();
        setTestData();
    }
    else if (trainDataSet) {
        setTrainData();
    }
    else if (testDataSet) {
        setTestData();
    }

    configColumns.map((col: any) => {
        if (trainDataSet && testDataSet) {
            let trainObject = mapObjectByLabel(col, "train_");
            let testObject = mapObjectByLabel(col, "test_");
            singleObject = { ...singleObject, ...trainObject, ...testObject, histogram };
        }
        else if (trainDataSet) {
            let trainObject = mapObjectByLabel(col, "train_");
            singleObject = { ...singleObject, ...trainObject, histogram };
        }
        else if (testDataSet) {
            let testObject = mapObjectByLabel(col, "test_");
            singleObject = { ...singleObject, ...testObject, histogram };
        }
    });
    return singleObject;

    // configColumns.map((col: any) => {
    //     /*Count will be taken heare*/
    //     if (trainDataSet[col.key]) {
    //         singleObject = { ...singleObject, ["train_" + col.key]: numericFilter(trainDataSet[col.key]), ["test_" + col.key]: numericFilter(testDataSet[col.key]), histogram };
    //     }
    //     /*mean, min, max and etc.. will be taken heare*/
    //     else if (trainStats[col.key]) {
    //         singleObject = { ...singleObject, ["train_" + col.key]: numericFilter(trainStats[col.key]), ["test_" + col.key]: numericFilter(trainStats[col.key]), histogram };
    //     }
    //     /*non missing will be taken here*/
    //     else if (trainCommonStats[col.key]) {
    //         singleObject = { ...singleObject, ["train_" + col.key]: numericFilter(trainCommonStats[col.key]), ["test_" + col.key]: numericFilter(testCommonStats[col.key]), histogram };
    //     }
    //     else if (trainTopValues && trainTopValues[col.key]) {
    //         singleObject = { ...singleObject, ["train_" + col.key]: trainTopValues[col.key], ["test_" + col.key]: testTopValues[col.key], histogram };
    //     }
    // });

}

export const onLoadData = (type: string, columns: any, uploadedJson?: any) => {


    trainDataSet = null;
    testDataSet = null;

    configColumns = columns;

    try {
        if (uploadedJson) {
            let uploadedDataSet = JSON.parse(uploadedJson).datasets;
            uploadedDataSet.map((data: any, index: number) => {
                if (data.name === 'train') {
                    trainDataSet = uploadedDataSet[index];
                }
                else if (data.name === 'test') {
                    testDataSet = uploadedDataSet[index];
                }
            })
            // if(uploadedDataSet.length === 2) {
            //     trainDataSet = uploadedDataSet[0];
            //     testDataSet = uploadedDataSet[1];
            // }

        }
        else {
            datasets.map((data: any, index: number) => {
                if (data.name === 'train') {
                    trainDataSet = datasets[index];
                }
                else if (data.name === 'test') {
                    testDataSet = datasets[index];
                }
            });
        }
        let normalizedDataSet: any[] = [];


        const normalizeData = (dataSet: any, index: number) => {
            if (type === 'NUMERIC') {
                if (!dataSet.features[index].type) {
                    let singleObject: any = readJson(type, index);
                    normalizedDataSet.push(singleObject);
                }
            }
            else if (dataSet.features[index].type === type) {
                let singleObject: any = readJson(type, index);
                normalizedDataSet.push(singleObject);
            }
        }

        if ((trainDataSet && testDataSet) || trainDataSet) {
            for (let i = 0; i < trainDataSet.features.length; i++) {
                normalizeData(trainDataSet, i);
            }
        }
        else if (testDataSet) {
            for (let i = 0; i < testDataSet.features.length; i++) {
                normalizeData(testDataSet, i);
            }
        }

        console.log('normalizedDataSet:', normalizedDataSet);

        return normalizedDataSet
    } catch (error) {
        console.log('ERROR');
        return null;
    }



}
