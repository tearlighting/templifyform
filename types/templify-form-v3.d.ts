

type TFormTemplate = {

}
interface ITemplifyFormStore<TProp extends string> {
    formData: Record<TProp, any>;
    formTemplate: Record<TProp, TFormTemplate>
    renderProps: Record<TProp, any>;
    errors: Record<TProp, string>;
    isVaild: boolean;
}