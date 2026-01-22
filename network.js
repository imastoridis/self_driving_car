//Creation of neurons: neuronCounts the num of neurons in each layer
class NeuralNetwork {
    constructor(neuronCounts) {
        this.levels = [];
        this.arr = [];
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i + 1]
            ));
        }
    }

    //Get outputs from the given inputs. Outputs will tells us if car should go forward, left..
    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(
            givenInputs, network.levels[0]);
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(
                outputs, network.levels[i]);
        }
        return outputs;
    }

    //Changes the network (bias and weight) a little bit by a random value from -1 to 1
    static mutate(network, amount = 1) {
        //Loop the levels
        network.levels.forEach(level => {
            //Loop the biases
            for (let i = 0; i < level.biases.length; i++) {

                //Change the bias using lerp 
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random() * 2 - 1, // Larp value will  between -1 and 1
                    amount
                )
            }

            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random() * 2 - 1,
                        amount
                    )
                }
            }
        });
    }
}

//The sensors will give us an input. We construct the network with this input 
class Level {
    constructor(inputCount, outputCount) {
        //Inputs from car sensors
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        //The value on inputs
        this.biases = new Array(outputCount);

        //Weight/importance of connection
        this.weights = [];
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }
        // console.log(this.weights)


        Level.#randomize(this);
    }

    //We randomise the biases so outputs are randomized too
    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    //Given an input, we conpute the output
    /**
     *    outputs *       *      *       *
     *            |
     *            |
     *    inputs  *        *      *       * 
     */
    static feedForward(givenInputs, level) {

        //If input is the same, find other solution?
        //   console.log(level.inputs)

        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0
            //Loop throught the inputs
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            //If sum is superior to the bias of the output, we put 1->good output to use
            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }

        return level.outputs;
    }
}