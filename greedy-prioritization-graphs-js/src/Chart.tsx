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

function numberToString(n: number): string {
    const lastDigit = n % 10;
    let suffix: string;
    switch (lastDigit) {
        case 1:
            suffix = "st";
            break;
        case 2:
            suffix = "nd";
            break;
        case 3:
            suffix = "rd";
            break;
        default:
            suffix = "th";
            break;
    }
    return `${n}${suffix}`;
}

function HSVtoRGB(h: number, s: number, v: number) {
    var r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
    }
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255),
    ];
}

function generateColor(step: number, steps: number): string {
    // Red = 0, Green = 120
    const increment = 120.0 / steps;
    const h = 120 - increment * step;
    const [r, g, b] = HSVtoRGB(h / 360.0, 1, 0.8);
    return `rgb(${r}, ${g}, ${b})`;
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

            let thisFeatureCost;
            // no refactor scenario
            if (scenario == 0) {
                thisFeatureCost = featureCost * featureIncrementalCost ** featureNumber;
            } else if (featureNumber === scenario) {
                // Refactoring at this step
                const additionalFeatureCost = featureCost * featureIncrementalCost ** (featureNumber - 1);
                const thisRefactorCost = refactorCost * refactorIncrementalCost ** featureNumber

                thisFeatureCost = featureCost + thisRefactorCost + additionalFeatureCost
            } else if (featureNumber < scenario) {
                // Getting greedy
                thisFeatureCost = featureCost * featureIncrementalCost ** featureNumber
            } else {
                // this is post-refactor
                thisFeatureCost = featureCost;
            }
            scenarioValues.push(previousCost + thisFeatureCost);
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

    const noRefactorScenario = {
        label: "No Refactor",
        data: featureCosts[0],
        borderColor: '#ff0000',
        backgroundColor: '#ff0000',
    };

    const datasets = [
        noRefactorScenario,
        ...featureCosts.slice(1).map((featureCost, index) => ({
            label: `Refactor with ${numberToString(index+1)} feature`,
            data: featureCost,
            borderColor: generateColor(index+1, featureCosts.length),
            backgroundColor: generateColor(index+1, featureCosts.length),
        }))
    ];

    return {labels, datasets};
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
