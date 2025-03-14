class Form {
    private formId: string;
    private formName: string;
    private fields: Field[];
    private titleAndControlLayout: TypeOfTitleAndControlLayout;

    constructor(formId: string, formName: string, fields: Field[], titleAndControlLayout?: TypeOfTitleAndControlLayout) {
        this.formId = formId;
        this.formName = formName;
        this.fields = fields;
        this.titleAndControlLayout = titleAndControlLayout ?? TypeOfTitleAndControlLayout.horizontal;
    }
    getFormId(): string {
        return this.formId;
    }
    getFormName(): string {
        return this.formName;
    }
    getFields(): Field[] {
        return this.fields;
    }

    getTitleAndControlLayout(): TypeOfTitleAndControlLayout {
        return this.titleAndControlLayout;
    }
}

export type TYPE_OF_VALUE = string|number|boolean|undefined|null;

abstract class Field {
    private fieldId: string;
    private fieldName: string;
    private fieldType: FieldType;
    private defaultValue: TYPE_OF_VALUE;
    private value: TYPE_OF_VALUE;
    private required: boolean;
    private readonly: boolean;
    private disabled: boolean;

    private helpText?: string;
    // private onValueChange?: (value: string|number) => void;

    constructor(fieldId: string, fieldName: string, fieldType: FieldType, defaultValue: TYPE_OF_VALUE, required: boolean, readonly: boolean, disabled: boolean, helpText?: string, 
        // onValueChange?:(value:string|number)=>void
    ) {
        this.fieldId = fieldId;
        this.fieldName = fieldName;
        this.fieldType = fieldType;
        this.defaultValue = defaultValue;
        this.value = defaultValue;
        this.required = required;
        this.readonly = readonly;
        this.disabled = disabled;
        this.helpText = helpText;
        // this.onValueChange = onValueChange;
    }
    getFieldId(): string {
        return this.fieldId;
    }
    getFieldName(): string {
        return this.fieldName;
    }
    getFieldType(): FieldType {
        return this.fieldType;
    }
    getDefaultValue(): TYPE_OF_VALUE {
        return this.defaultValue;
    }
    getValue(): TYPE_OF_VALUE {
        return this.value;
    }
    setValue(value: TYPE_OF_VALUE): void {
        this.value = value;
    }
    getRequired(): boolean {
        return this.required;
    }
    getReadonly(): boolean {
        return this.readonly;
    }
    getDisabled(): boolean {
        return this.disabled;
    }
    getHelpText(): string | undefined {
        return this.helpText;
    }
    // getOnValueChange():((value: string|number)=>void) | undefined{
    //     return this.onValueChange;
    // }
}

class InputField extends Field {
    private placeholder: string;
    private maxLength?: number;

    constructor(fieldId: string, fieldName: string, fieldType: FieldType, defaultValue: TYPE_OF_VALUE, required: boolean, readonly: boolean, disabled: boolean, placeholder: string, maxLength: number) {
        super(fieldId, fieldName, fieldType, defaultValue, required, readonly, disabled);
        this.placeholder = placeholder;
        this.maxLength = maxLength;
    }
    getPlaceholder(): string {
        return this.placeholder;
    }
    getMaxLength(): number | undefined {
        return this.maxLength;
    }
}

class InputNumberField extends Field {
    private placeholder: string;
    private min?: number;
    private max?: number;
    private step?: number;
    private precision?: number;

    constructor(
        fieldId: string,
        fieldName: string,
        fieldType: FieldType,
        defaultValue: TYPE_OF_VALUE,
        required: boolean,
        readonly: boolean,
        disabled: boolean,
        placeholder: string,
        min?: number,
        max?: number,
        step?: number,
        precision?: number,
        helpText?: string
    ) {
        super(fieldId, fieldName, fieldType, defaultValue, required, readonly, disabled, helpText);
        this.placeholder = placeholder;
        this.min = min;
        this.max = max;
        this.step = step;
        this.precision = precision;
    }

    getPlaceholder(): string {
        return this.placeholder;
    }

    getMin(): number | undefined {
        return this.min;
    }

    getMax(): number | undefined {
        return this.max;
    }

    getStep(): number | undefined {
        return this.step;
    }

    getPrecision(): number | undefined {
        return this.precision;
    }
}

export interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}

class SelectField extends Field {
    private options: SelectOption[];
    private placeholder: string;

    constructor(
        fieldId: string,
        fieldName: string,
        fieldType: FieldType,
        defaultValue: TYPE_OF_VALUE,
        required: boolean,
        readonly: boolean,
        disabled: boolean,
        placeholder: string,
        options: SelectOption[],
        helpText?: string
    ) {
        super(fieldId, fieldName, fieldType, defaultValue, required, readonly, disabled, helpText);
        this.options = options;
        this.placeholder = placeholder;
    }

    getOptions(): SelectOption[] {
        return this.options;
    }

    getPlaceholder(): string {
        return this.placeholder;
    }
}

enum ButtonType {
    PRIMARY='primary',
    DEFAULT = 'default', 
    DASHED = 'dashed',
    LINK = 'link',
    TEXT = 'text',
}

class Button {
    private buttonId: string;
    private type: ButtonType | undefined;
    private label: string;
    private disabled: boolean;

    constructor(buttonId: string, label: string, 
        type: ButtonType | undefined, 
        disabled: boolean, onClick?: () => void) {
        this.buttonId = buttonId;
        this.label = label;
        this.type = type;
        this.disabled = disabled;
    }

    getButtonId(): string{
        return this.buttonId;
    }

    getType(): ButtonType | undefined {
        return this.type;
    }

    getLabel(): string {
        return this.label
    }

    getDisabled(): boolean {
        return this.disabled;
    }
}

enum FieldType{
    TEXT = 'text',
    TEXTAREA = 'textarea',
    PASSWORD = 'password',
    NUMBER = 'number',
    DATE = 'date',
    TIME = 'time',
    SELECT = 'select',
    RADIO = 'radio',
    CHECKBOX = 'checkbox',
}

/**
 * 标题和控件布局
 */
enum TypeOfTitleAndControlLayout{
    horizontal = 'horizontal',
    vertical = 'vertical',
}

export { Form, Field, InputField, InputNumberField, SelectField, FieldType, TypeOfTitleAndControlLayout, Button };

export interface ControlProps {
    field: Field;
    onChangeValue?: (value: TYPE_OF_VALUE) => void;
    [key: string]: any;
}
  
export interface ButtonProps {
    buttonId: string;
    type: ButtonType | undefined;
    label: string;
    disabled: boolean;
    submit:()=>void;
}