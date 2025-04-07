export const AddNewProperty = async (formData: any, token: string) => {
    let result = {
        data: null,
        error: null
    }
    try {
        const response = await fetch("https://limpiar-backend.onrender.com/api/properties", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Set the Bearer token
          },
          body: formData,
        });

        const data = await response.json();
        result.data = data
  
        if (!response.ok) {
          throw new Error(data.message || "Unable to add Property");
        }

    } catch (err: any) {
        console.log(err);
        result.error = err
    } finally {
        return result
    }
}