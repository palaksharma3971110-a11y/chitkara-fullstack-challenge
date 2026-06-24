async function submitData() {

    const text = document.getElementById("inputData").value;

    const data = text
        .split(",")
        .map(x => x.trim())
        .filter(x => x);

    const response = await fetch("https://chitkara-fullstack-challenge-production.up.railway.app/bfhl", {
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