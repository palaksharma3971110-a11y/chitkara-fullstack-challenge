async function submitData() {

    const text = document.getElementById("inputData").value;

    const data = text
        .split(",")
        .map(x => x.trim())
        .filter(x => x);

    const response = await  {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ data })
    });

    const result = await response.json();

    document.getElementById("output").textContent =
        JSON.stringify(result, null, 2);
}