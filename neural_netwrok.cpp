
#include <iostream>
#include <vector>
#include <cmath>

using namespace std;

// Function (sigmoid)
double sigmoid(double x) {
    return 1.0 / (1.0 + exp(-x));
}

// Multiply by weights and add bias
vector<double> applyLayer(const vector<double>& input, const vector<vector<double>>& weights) {
    vector<double> output;
    for (const auto& neuron_weights : weights) {
        double sum = 0.0;
        for (size_t i = 0; i < input.size(); ++i) {
            sum += neuron_weights[i] * input[i];
        }
        output.push_back(sigmoid(sum));
    }
    return output;
}

int main() {
    int inputSize;
    cout << "Enter number of input neurons: ";
    cin >> inputSize;

    vector<double> input(inputSize);
    cout << "Enter input values:\n";
    for (int i = 0; i < inputSize; ++i) {
        cout << "Input " << i + 1 << ": ";
        cin >> input[i];
    }

    int numHiddenLayers;
    cout << "Enter number of hidden layers (at least 2): ";
    cin >> numHiddenLayers;

    if (numHiddenLayers < 2) {
        cout << "Error: Must be at least 2 hidden layers.\n";
        return 1;
    }

    vector<double> currentInput = input;

    // Execute hidden layers
    for (int layer = 0; layer < numHiddenLayers; ++layer) {
        int neurons;
        cout << "\nLayer " << layer + 1 << " - number of neurons: ";
        cin >> neurons;

        vector<vector<double>> weights(neurons, vector<double>(currentInput.size()));
        for (int i = 0; i < neurons; ++i) {
            cout << "Enter weights for neuron " << i + 1 << ":\n";
            for (size_t j = 0; j < currentInput.size(); ++j) {
                cout << "Weight " << j + 1 << ": ";
                cin >> weights[i][j];
            }
        }

        currentInput = applyLayer(currentInput, weights);
        cout << "Output of layer " << layer + 1 << ": ";
        for (double val : currentInput) {
            cout << val << " ";
        }
        cout << endl;
    }

    // Execute output layer
    int outputNeurons;
    cout << "\nEnter number of neurons in output layer: ";
    cin >> outputNeurons;

    vector<vector<double>> outputWeights(outputNeurons, vector<double>(currentInput.size()));
    for (int i = 0; i < outputNeurons; ++i) {
        cout << "Enter weights for output neuron " << i + 1 << ":\n";
        for (size_t j = 0; j < currentInput.size(); ++j) {
            cout << "Weight " << j + 1 << ": ";
            cin >> outputWeights[i][j];
        }
    }

    vector<double> finalOutput = applyLayer(currentInput, outputWeights);
    cout << "Final Output: ";
    for (double val : finalOutput) {
        cout << val << " ";
    }
    cout << endl;

    return 0;
}
