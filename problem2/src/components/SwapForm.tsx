import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { Token, FormData } from "../types/token";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Form } from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, RefreshCw } from "lucide-react";

const CurrencySwapForm: React.FC = () => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [tokens, setTokens] = useState<string[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [swappedAmount, setSwappedAmount] = useState<number | null>(null);
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm();
  const watchFields = watch(["fromCurrency", "toCurrency"]);

  useEffect(() => {
    const fetchPrices = async () => {
      const response = await axios.get<Token[]>("https://interview.switcheo.com/prices.json");
      const priceData: Record<string, number> = {};
      response.data.forEach((token) => {
        priceData[token.currency] = token.price;
      });
      setPrices(priceData);
      setTokens(Object.keys(priceData));
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    if (watchFields[0] && watchFields[1]) {
      setIsDuplicate(watchFields[0] === watchFields[1]);
    }
  }, [watchFields]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600)).then(() => {
      const fromPrice = prices[data.fromCurrency];
      const toPrice = prices[data.toCurrency];
      if (fromPrice && toPrice) {
        const exchangeRate = fromPrice / toPrice;
        setExchangeRate(exchangeRate);
        const swappedAmount = data.amount * exchangeRate;
        setSwappedAmount(swappedAmount);
      } else {
        setExchangeRate(0);
        setSwappedAmount(0);
      }
      setIsLoading(false);
    });
  };

  return (
    <div className="h-screen w-full bg-zinc-50 flex items-center justify-center ">
      <div className="w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-4 text-center">Currency Swap</h1>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700">From Currency</label>
              <Controller
                name="fromCurrency"
                control={control}
                rules={{ required: "From currency is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent className="w-full bg-white">
                      {tokens.map((token) => (
                        <SelectItem key={token} value={token}>
                          <div className="flex items-center gap-2">
                            <img src={`/tokens/${token}.svg`} alt={token} className="w-6 h-6 inline-block" />
                            <p>{token}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.fromCurrency && <span className="text-red-500">This field is required</span>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">To Currency</label>
              <Controller
                name="toCurrency"
                control={control}
                rules={{ required: "To currency is required" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent className="w-full bg-white">
                      {tokens.map((token) => (
                        <SelectItem key={token} value={token}>
                          <div className="flex items-center gap-2">
                            <img src={`/tokens/${token}.svg`} alt={token} className="w-6 h-6 inline-block" />
                            <p>{token}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.toCurrency && <span className="text-red-500">{errors.toCurrency.message || "This field is required"}</span>}
            </div>

            {isDuplicate && <span className="text-red-500 my-2">Cannot swap the same currency</span>}

            <div className="mb-4">
              <label className="block text-gray-700">Amount</label>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: "Amount is required",
                  min: { value: 0.01, message: "Amount must be greater than 0" },
                  pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: "Invalid number format" },
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter amount"
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9.]/g, "");
                      field.onChange(numericValue);
                    }}
                  />
                )}
              />
              {errors.amount && <span className="text-red-500">{errors.amount.message ?? ""}</span>}
            </div>

            <Button type="submit" className={`w-full bg-emerald-500 text-white text-md rounded-lg`} disabled={Object.keys(errors).length > 0 || isDuplicate}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-center">Swap</p>
                  <span>
                    <RefreshCw size={20} />
                  </span>
                </div>
              )}
            </Button>
          </form>
        </Form>
        {exchangeRate !== null && (
          <div className="mt-4">
            <p>Exchange Rate: {exchangeRate}</p>
            <p>
              You will receive: <strong>{swappedAmount}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencySwapForm;
