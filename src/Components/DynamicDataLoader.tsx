import React from 'react';
import { onLoadData, onGetConfigData } from '../Services';
import DynamicTable from './DynamicTable';
import Loading from './Loading';

interface Props {
  featureType: string,
  uploadedJson?: any,
  configData?: any,
}

const DynamicDataLoader: React.FC<Props> = ({ featureType, uploadedJson, configData }) => {
  const [state, setState] = React.useState<any>({ loading: true, title: '', columns: [], rows: [], graphConfig: [], error: false });
  const loadData = async () => {
    // let configData = await onGetConfigData(featureType);
    setState({ ...state, loading: true })
    let rows = await onLoadData(featureType, configData?.columns, uploadedJson);
    if (rows) {
      setState({ ...state, loading: false, title: configData?.title, columns: configData?.columns, rows: rows, graphConfig: configData?.graphConfig, error: false });
    }
    else {
      setState({ ...state, loading: false, error: true });
    }
  }

  React.useEffect(() => {
    loadData();
  }, [uploadedJson]);




  return (
    <div>
      {
        (state.loading) ?
          // <h1>Loading...</h1>
          <Loading visibility={state.loading} />
          :
          (state.error) ?
            <h1>Invalid file to process</h1>
            :


            <DynamicTable
              tableTitle={state.title}
              columns={state.columns}
              rows={state.rows}
              graphConfig={state.graphConfig}
              featureType={featureType}
            />


      }
    </div>
  )
}

export default React.memo(DynamicDataLoader);