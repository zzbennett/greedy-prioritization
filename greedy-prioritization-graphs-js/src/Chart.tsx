import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Greedy Prioritization Sandbox',
        },
    },
};

function range(length: number) {
   return Array.from({length: length}, (x, i) => i);
}

// numFeatures = number of addl features. 0 = "plot only feature 1" (minimum)
export const genData = (inputs: ChartProps) => {
    console.log("CALLING GEN DATA")
    const {
        numFeatures,
        refactorCost,
        refactorMarginalCost,
        featureCost,
        featureMarginalCost,
    } = inputs;
    const featureIncrementalCost = 1 + (featureMarginalCost / 100.0);
    const refactorIncrementalCost = 1 + (refactorMarginalCost / 100.0);

    if (numFeatures <= 0) {
        console.log("error! num features can't be 0, must be at least 1");
        return {
            labels: [],
            datasets: [],
        }
    }

    let labels = range(numFeatures-1).map((x,i) => { return "Feature "+(i+2)});
    labels = ["Feature 1"].concat(labels)

    const featureCosts: number[][] = [];
    console.log("numFeatures: "+numFeatures.toString())
    console.log("featureCost: "+featureCost.toString())
    console.log("refactorCost: "+refactorCost.toString())
    console.log("refactorMarginalCost: "+refactorMarginalCost.toString())
    console.log("featureMarginalCost: "+featureMarginalCost.toString())
    console.log("featureCosts: "+JSON.stringify(featureCosts))

    // scenario 0: no refactor
    // scenario 1: refactor with 2nd feature
    // scenario 2: refactor with 3rd feature
    // ...
    for (let scenario = 0; scenario < labels.length; scenario++) {
        // scenarioValues are the cumulative costs of adding the Nth feature
        // scenarioValues[0] is a fixed cost and the same for all scenarios (the "green field" first feature)
        const scenarioValues: number[] = [];
        for (let featureNumber = 0; featureNumber < labels.length; featureNumber++) {
            const previousCost = scenarioValues.length ? scenarioValues[scenarioValues.length-1] : 0;
            // no refactor scenario
            if (scenario == 0) {
                scenarioValues.push(previousCost + featureCost * featureIncrementalCost ** featureNumber);
            } else if (featureNumber === scenario) {
                // Refactoring at this step
                const additionalFeatureCost = featureCost * featureIncrementalCost ** (featureNumber - 1);
                scenarioValues.push(
                    featureCost
                    + previousCost
                    + refactorCost * refactorIncrementalCost ** featureNumber
                    + additionalFeatureCost
                )
            } else if (featureNumber < scenario) {
                // Getting greedy
                // this is pre-refactor
                scenarioValues.push(previousCost + (featureCost * featureIncrementalCost ** featureNumber));
            } else {
                // this is post-refactor
                scenarioValues.push(previousCost + featureCost);
            }
        }
        featureCosts.push(scenarioValues);
    }

    console.log("numFeatures: "+numFeatures.toString())
    console.log("featureCost: "+featureCost.toString())
    console.log("refactorCost: "+refactorCost.toString())
    console.log("refactorMarginalCost: "+refactorMarginalCost.toString())
    console.log("featureMarginalCost: "+featureMarginalCost.toString())
    console.log("featureCosts: "+JSON.stringify(featureCosts))
    console.log(featureCosts.toString())
    return {
        labels: labels,
        datasets: [
            {
                label: 'No Refactor',
                data: featureCosts[0],
                borderColor: 'rgb(100, 99, 132)',
                backgroundColor: 'rgba(100, 99, 132, 0.5)',
            },
            {
                label: 'Refactor with second feature',
                data: featureCosts[1],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Refactor with third feature',
                data: featureCosts[2],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Refactor with fourth feature',
                data: featureCosts[3],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Refactor with fifth feature',
                data: featureCosts[4],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    }
};

type ChartProps = {
    numFeatures: number
    refactorCost: number
    featureCost: number
    featureMarginalCost: number
    refactorMarginalCost: number
}

function Chart(props: ChartProps) {
    return <Line options={options} data={genData(props)} />;
}

export default Chart;