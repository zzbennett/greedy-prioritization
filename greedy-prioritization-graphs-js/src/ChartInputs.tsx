import React from 'react';


type TextInputProps = {
    label: string,
    type?: string,
    value?: any,
    onChange: (e: any) => void
};

const inputStyle = {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "comic sans",
    color: "green",
    width: "100%",
    transform: "rotate(1deg)",
    backgroundImage: "linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)",
    borderStyle: "groove",
    borderWidth: "10px",
    borderColor: "#22fff2a"
}

function TextInput(props: TextInputProps) {
    const {value, type, onChange, label, ...rest} = props;
    const id = label.replace(" ", "-")
    return (
        <div style={inputStyle}>
            <label htmlFor={id}>
                {props.label}
            </label>
            <input id={id} value={props.value} type={props.type} onChange={(e) => props.onChange(parseInt(e.target.value))} {...rest} />
        </div>
    );
}

TextInput.defaultProps = {type: "number"};

interface FieldDescription {
    label: string
    type?: string
    value: any
    onChange: (e: any) => void
}

type ChartInputsProps = {
    inputs: FieldDescription[]
}

export default function ChartInputs(props: ChartInputsProps) {
    return (
       <div style={{display: "flex", flexDirection: "column", width: "600px"}}>
           {
               props.inputs.map(
                   (input, index) => <TextInput
                       label={input.label}
                       onChange={input.onChange}
                       value={input.value}
                       type={input.type}
                       key={index}
                   />
               )
           }
       </div>
    );
}