import React from 'react';
import { Field, Button,TYPE_OF_VALUE,TypeOfTitleAndControlLayout } from '@/types/form';
import CustomField from '@/components/form/CustomField';
import CustomButton from '@/components/controls/CustomButton';

interface CustomFormProps {
  title:string, 
  fields: Field[];
  buttons: Button[];
  titleAndControlLayout: TypeOfTitleAndControlLayout; //  for example: 'horizontal' or 'vertical'
}


const CustomForm: React.FC<CustomFormProps> = ({ title, fields, buttons, titleAndControlLayout }) => {
  const values:{[key:string]:TYPE_OF_VALUE} = {}
  const handleChangeValue = (fieldId:string,value:TYPE_OF_VALUE)=>{
    values[fieldId]=value;
  };

  const submit = ()=>{
    console.log(`submit:${JSON.stringify(values)}`);
  }

  return (
    <div>
      <div style={{ 
        fontSize: '16px', 
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333'
      }}>
        {title}
      </div>
      
      {fields.map((field) => (
        <CustomField
          key={field.getFieldName()}
          field={field}
          titleAndControlLayout={titleAndControlLayout}
          onChangeValue={handleChangeValue}
        />
      ))}
      {buttons.map((button) => (
        <CustomButton
          key={button.getLabel()}
          buttonId={button.getButtonId()}
          type={button.getType()}
          label={button.getLabel()}
          disabled={button.getDisabled()}
          submit={submit}
        />
      ))}
    </div>
  );
};

export default CustomForm;