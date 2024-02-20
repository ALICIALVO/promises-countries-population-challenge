function getCountryPopulation(country){
    return new Promise((resolve,reject)=> {
        const url = `https://countriesnow.space/api/v0.1/countries/population`;
        const options = {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({country})
        };
        fetch(url,options)
            .then(res => res.json())
            .then(json => {
                if (json?.data?.populationCounts) resolve(json.data.populationCounts.at(-1).value);
                else reject(new Error(`My Error: no data for ${country}`)) //app logic error message
            })
            .catch(err => reject(err)) // network error - server is down for example...
            // .catch(reject)  // same same, only shorter... 
    })
}


//--------------------------------------------------------
//  Manual - call one by one...
//--------------------------------------------------------
// function manual() {
//     getCountryPopulation("France")
//         .then( population => {
//             console.log(`population of France is ${population}`);
//             return getCountryPopulation("Germany")
//         })
//         .then( population => console.log(`population of Germany is ${population}`))
//         .catch(err=> console.log('Error in manual: ',err.message));
// }
// manual()


//------------------------------
//   Sequential processing 
//------------------------------
const countries = ["France","Russia","Germany","United Kingdom","Portugal","Spain","Netherlands","Sweden","Greece","Czechia","Romania","Israel"];

function sequence() {
    const populationData = []; // array to store population data

    Promise.each(countries, (country) => {
        return getCountryPopulation(country)
            .then((population) => {
                const populationInfo = `Population of ${country} is ${population}`;
                populationData.push(populationInfo); // push population information into the populationData array
            })
            .catch((err) => {
                console.error(`Error getting population for ${country}:`, err.message);
            });
    })
    .then(() => {
        // log population data
        for (const info of populationData) {
            console.log(info);
        }
        console.log('all done!');
    });
    // .catch((err) => {
    //     console.error('Error in sequence:', err.message);
    // });
}

sequence();


//--------------------------------------------------------
//  Parallel processing 
//--------------------------------------------------------
function parallel() {
    Promise.map(countries, (country) => {
        return getCountryPopulation(country)
        .then((population) => {
            return `Population of ${country} is ${population}`;
        })
        .catch((err) => {
            console.error(`Error getting population for ${country}:`, err.message);
            return ''; // return empty string if there's an error to maintain the order
        });
    })
    .then((populationData) => {
        const validPopulationData = populationData.filter(info => info); // filter out empty strings
        for (const info of validPopulationData) {
            console.log(info); // log population info for each country
        }
        console.log('all done'); // log "all done" after all promises are resolved
    });
    // .catch((err) => {
    //     console.error('Error in parallel:', err.message); // handle any error during parallel processing
    // });
}

parallel();
