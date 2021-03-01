
import React from 'react';
import { onLoadData, onGetConfigData } from '../Services';
import DynamicTable from '../Components/DynamicTable';

function CategoricalFeatures() {
  //read config here
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const [state, setState] = React.useState<any>({ loading: true, title: '', columns: [], rows: [] });

  const loadData = async () => {
    // let configData = onGetConfigData('STRING');
    // let rows = await onLoadData('STRING', configData?.columns);
    // setState({ ...state, loading: false, title: configData?.title, columns: configData?.columns, rows: rows });
  }

  React.useEffect(() => {
    loadData();
  }, []);


  return (
    <div>
      {
        (!state.loadnig) &&
        <DynamicTable
          tableTitle={state.title}
          columns={state.columns}
          rows={state.rows}
          graphConfig={[{ type: 'Bar', displayName: 'Standard' }]}
        // radios={state.radios}
        // graph={state.graph}
        />
      }
    </div>
  )
}

export default CategoricalFeatures;