import React from 'react';
import Chart from "./Chart";
import ChartInputs from "./ChartInputs";

function App() {
    const [numFeatures, setNumFeatures] = React.useState(5);
    const [refactorCost, setRefactorCost] = React.useState(5);
    const [featureCost, setFeatureCost] = React.useState(5);
    const [featureMarginalCost, setFeatureMarginalCost] = React.useState(20);
    const [refactorMarginalCost, setRefactorMarginalCost] = React.useState(10);

    const inputs = [
        {
            label: "# Features",
            onChange: setNumFeatures,
            value: numFeatures,
            min: 0,
        },
        {
            label: "Refactor Cost",
            onChange: setRefactorCost,
            value: refactorCost,
            min: 0,
        },
        {
            label: "Refactor Marginal Cost %",
            onChange: setRefactorMarginalCost,
            value: refactorMarginalCost,
            min: 0,
        },
        {
            label: "Feature Cost",
            onChange: setFeatureCost,
            value: featureCost,
            min: 0,
        },
        {
            label: "Feature Marginal Cost %",
            onChange: setFeatureMarginalCost,
            value: featureMarginalCost,
            min: 0,
        }
    ]

    return (
        <div>
            <ChartInputs inputs={inputs} />
            <Chart
                numFeatures={numFeatures}
                refactorCost={refactorCost}
                featureCost={featureCost}
                featureMarginalCost={featureMarginalCost}
                refactorMarginalCost={refactorMarginalCost}
            />
        </div>
    )
}

export default App;
