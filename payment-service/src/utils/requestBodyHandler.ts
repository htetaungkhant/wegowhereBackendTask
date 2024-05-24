export const requiredFieldsFromRequestBody = (requiredFields: string[], body: any) => {
    const missingFields = requiredFields.filter((field) => !body[field]);
    return missingFields;
}