import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { ethers } from 'ethers';

const ContractInteraction = ({ isConnected, smartAccountAddress, signer }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [contractValue, setContractValue] = useState(0);
  const [functionName, setFunctionName] = useState('');
  const [manualCalldata, setManualCalldata] = useState('');
  const [encodedCalldata, setEncodedCalldata] = useState('');
  const [parameters, setParameters] = useState([{ type: 'address', value: '' }]);
  const [isValid, setIsValid] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });

  const paramTypes = [
    { label: 'address', value: 'address' },
    { label: 'uint256', value: 'uint256' },
    { label: 'string', value: 'string' },
    { label: 'bool', value: 'bool' },
    { label: 'bytes', value: 'bytes' },
    { label: 'uint8', value: 'uint8' },
    { label: 'uint32', value: 'uint32' },
  ];

  // Validate contract address
  useEffect(() => {
    setIsValid(ethers.isAddress(contractAddress));
  }, [contractAddress]);

  // Add parameter
  const addParameter = () => {
    setParameters([...parameters, { type: 'address', value: '' }]);
  };

  // Remove parameter
  const removeParameter = (index) => {
    const updatedParams = [...parameters];
    updatedParams.splice(index, 1);
    setParameters(updatedParams);
  };

  // Update parameter
  const updateParameter = (index, field, value) => {
    const updatedParams = [...parameters];
    updatedParams[index][field] = value;
    setParameters(updatedParams);
  };

  // Encode function call
  const encodeFunction = () => {
    try {
      if (manualCalldata.trim()) {
        // Use manual calldata
        setEncodedCalldata(manualCalldata);
        setStatus({ message: 'Using manual calldata', type: 'success' });
        return;
      }

      if (!functionName) {
        throw new Error('Please enter a function name');
      }

      // Get parameters
      const types = [];
      const values = [];

      parameters.forEach(param => {
        if (param.value.trim()) {
          types.push(param.type);
          values.push(param.value);
        }
      });

      // Create function signature
      const functionSignature = `${functionName}(${types.join(',')})`;

      // Create interface and encode
      const iface = new ethers.Interface([`function ${functionSignature}`]);
      const encodedData = iface.encodeFunctionData(functionName, values);

      setEncodedCalldata(encodedData);
      setStatus({ message: 'Function encoded successfully!', type: 'success' });

    } catch (error) {
      console.error('Encoding error:', error);
      setStatus({ message: `Encoding failed: ${error.message}`, type: 'error' });
    }
  };

  // Execute contract call (simulated)
  const executeContractCall = async () => {
    try {
      if (!smartAccountAddress) {
        throw new Error('Please deploy a smart account first');
      }

      if (!ethers.isAddress(contractAddress)) {
        throw new Error('Invalid contract address');
      }

      if (!encodedCalldata) {
        throw new Error('Please encode the function call first');
      }

      setStatus({ message: 'Executing contract call...', type: 'info' });

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setStatus({ message: 'Contract call executed successfully!', type: 'success' });

    } catch (error) {
      console.error('Contract call error:', error);
      setStatus({ message: `Contract call failed: ${error.message}`, type: 'error' });
    }
  };

  return (
    <div className="card full-width contract-interaction">
      <h2>
        <i className="pi pi-cog mr-2"></i>
        Advanced Contract Interaction
      </h2>
      
      <div className="grid">
        <div className="col-6">
          <div className="p-field mb-4">
            <label htmlFor="contractAddress" className="block mb-2">Contract Address</label>
            <InputText 
              id="contractAddress" 
              value={contractAddress} 
              onChange={(e) => setContractAddress(e.target.value)} 
              className="w-full" 
              placeholder="0x..." 
            />
          </div>
        </div>
        <div className="col-6">
          <div className="p-field mb-4">
            <label htmlFor="contractValue" className="block mb-2">ETH Value (if payable)</label>
            <InputNumber 
              id="contractValue" 
              value={contractValue} 
              onValueChange={(e) => setContractValue(e.value)} 
              mode="decimal" 
              className="w-full" 
            />
          </div>
        </div>
      </div>

      <div className="function-builder">
        <h3 style={{ color: '#10b981', marginBottom: '15px' }}>🔧 Function Builder</h3>
        
        <div className="p-field mb-4">
          <label htmlFor="functionName" className="block mb-2">Function Name</label>
          <InputText 
            id="functionName" 
            value={functionName} 
            onChange={(e) => setFunctionName(e.target.value)} 
            className="w-full" 
            placeholder="e.g., transfer, approve, mint" 
          />
        </div>

        <div id="functionInputs">
          {parameters.map((param, index) => (
            <div className="input-group" key={index}>
              <div className="p-field" style={{ margin: 0, flex: 1 }}>
                <label className="block mb-2">Parameter Type</label>
                <Dropdown
                  value={param.type}
                  options={paramTypes}
                  onChange={(e) => updateParameter(index, 'type', e.value)}
                  className="w-full"
                />
              </div>
              <div className="p-field" style={{ margin: 0, flex: 2 }}>
                <label className="block mb-2">Parameter Value</label>
                <InputText
                  value={param.value}
                  onChange={(e) => updateParameter(index, 'value', e.target.value)}
                  className="w-full"
                  placeholder="Enter value..."
                />
              </div>
              {parameters.length > 1 && (
                <Button
                  icon="pi pi-times"
                  className="p-button-rounded p-button-danger p-button-text ml-2 mt-4"
                  onClick={() => removeParameter(index)}
                />
              )}
            </div>
          ))}
        </div>

        <Button
          label="Add Parameter"
          icon="pi pi-plus"
          className="p-button-success p-button-text mt-2"
          onClick={addParameter}
        />

        <div className="p-field mt-4">
          <label htmlFor="manualCalldata" className="block mb-2">Or Enter Manual Calldata (Advanced)</label>
          <InputTextarea
            id="manualCalldata"
            value={manualCalldata}
            onChange={(e) => setManualCalldata(e.target.value)}
            rows={3}
            className="w-full"
            placeholder="0x... (leave empty to use function builder)"
          />
        </div>
      </div>

      <div className="grid mt-4">
        <div className="col-6">
          <Button
            label="Encode Function"
            icon="pi pi-code"
            className="p-button-secondary w-full"
            onClick={encodeFunction}
          />
        </div>
        <div className="col-6">
          <Button
            label="Execute Contract Call"
            icon="pi pi-send"
            className="w-full"
            onClick={executeContractCall}
            disabled={!isConnected || !smartAccountAddress || !isValid || !encodedCalldata}
          />
        </div>
      </div>

      {encodedCalldata && (
        <div className="mt-4">
          <h4 style={{ color: '#fbbf24', margin: '15px 0 10px 0' }}>Encoded Calldata:</h4>
          <div className="address">{encodedCalldata}</div>
        </div>
      )}

      {status.message && (
        <div className={`status ${status.type} show`}>
          {status.message}
        </div>
      )}

      <div className="feature-highlight">
        <h4>🎯 Contract Interaction Guide</h4>
        <p><strong>Function Builder:</strong> Enter the function name and parameters to automatically encode the call.</p>
        <p><strong>Manual Calldata:</strong> For advanced users who want to provide pre-encoded function data.</p>
        <p><strong>Examples:</strong> transfer(address,uint256), approve(address,uint256), mint(address,uint256)</p>
      </div>
    </div>
  );
};

export default ContractInteraction; 