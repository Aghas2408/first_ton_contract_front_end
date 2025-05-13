import { useEffect, useState } from "react";
import { useTonClient } from "./useTonClient";
import { Address, type OpenedContract } from "ton-core";
import { useAsyncInitialize } from "./useAsyncinitialize";
import { Counter } from "../../contracts/Counter";

export function useMainContract() {
    const client = useTonClient();
    const [contractData, setContractData] = useState<null | {
        counter_value: number;
        recent_sender: Address;
        owner_address: Address;
    }>();

    const mainContract = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new Counter(
            Address.parse("EQCS7PUYXVFI-4uvP1_vZsMVqLDmzwuimhEPtsyQKIcdeNPu") // replace with your address from tutorial 2 step 8
        );
        return client.open(contract) as OpenedContract<Counter>;
    }, [client]);

    useEffect(() => {
        async function getValue() {
            if (!mainContract) return;
            setContractData(null);
            const val = await mainContract.getCounter();
            setContractData({
                counter_value: val.number,
                recent_sender: val.recent_sender,
                owner_address: val.owner_address,
            });
        }
        getValue();
    }, [mainContract]);

    return {
        contract_address: mainContract?.address.toString(),
        ...contractData,
    };
}