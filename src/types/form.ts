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

abstract class Field {
    private fieldId: string;
    private fieldName: string;
    private fieldType: FieldType;
    private defaultValue: string|number|boolean;
    private value: string|number|boolean;
    private required: boolean;
    private readonly: boolean;
    private disabled: boolean;

    private helpText?: string;

    constructor(fieldId: string, fieldName: string, fieldType: FieldType, defaultValue: string|number|boolean, required: boolean, readonly: boolean, disabled: boolean, helpText?: string) {
        this.fieldId = fieldId;
        this.fieldName = fieldName;
        this.fieldType = fieldType;
        this.defaultValue = defaultValue;
        this.value = defaultValue;
        this.required = required;
        this.readonly = readonly;
        this.disabled = disabled;
        this.helpText = helpText;
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
    getDefaultValue(): string|number|boolean {
        return this.defaultValue;
    }
    getValue(): string|number|boolean {
        return this.value;
    }
    setValue(value: string|number|boolean): void {
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
}

class InputField extends Field {
    private placeholder: string;
    private maxLength?: number;

    constructor(fieldId: string, fieldName: string, fieldType: FieldType, defaultValue: string|number|boolean, required: boolean, readonly: boolean, disabled: boolean, placeholder: string, maxLength: number) {
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
        defaultValue: string|number|boolean,
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
        defaultValue: string|number|boolean,
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

export { Form, Field, InputField, InputNumberField, SelectField, FieldType, TypeOfTitleAndControlLayout };

