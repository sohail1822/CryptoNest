import React from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";
import { ROUTES } from "../../../shared/constants/routes";
import {
  formatCryptoQuantity,
  formatCurrency,
  formatPercentage,
} from "../../../shared/utils/formatters";

const PortfolioCard = ({ stock, coinData }) => {
  const navigate = useNavigate();

  if (!stock) return null;

  const currentValue = coinData ? stock.quantity * coinData.currentPrice : 0;
  const profitLoss = currentValue - stock.total_amount;
  const profitPercent =
    stock.total_amount > 0
      ? (profitLoss / stock.total_amount) * 100
      : 0;
  const isProfit = profitLoss >= 0;

  const handleSell = (e) => {
    e.stopPropagation();
    navigate(ROUTES.sell(stock.stockId), {
      state: { quantity: stock.quantity },
    });
  };

  return (
    <div
      className="ent-card p-5 ent-card-hover group cursor-pointer"
      onClick={() => navigate(ROUTES.coin(stock.stockId))}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {coinData?.image ? (
            <img
              src={coinData.image}
              alt={stock.stockId}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full ui-skeleton" />
          )}
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] capitalize">
              {stock.stockId}
            </h3>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
              {formatCryptoQuantity(stock.quantity, { maximumFractionDigits: 4 })} Units
            </p>
          </div>
        </div>
        <div
          className={`text-xs font-bold ${isProfit ? "text-emerald-500" : "text-rose-500"}`}
        >
          {isProfit ? "▲" : "▼"} {formatPercentage(Math.abs(profitPercent))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.1em] mb-1">
            Current Value
          </p>
          <p className="text-base font-bold text-[var(--text-primary)]">
            {formatCurrency(currentValue, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.1em] mb-1">
            Profit/Loss
          </p>
          <p
            className={`text-base font-bold ${isProfit ? "text-emerald-500" : "text-rose-500"}`}
          >
            {isProfit ? "+" : "-"}{formatCurrency(Math.abs(profitLoss), { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSell}
          className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border border-rose-500/20 text-rose-500 rounded hover:bg-rose-500 hover:text-white transition-all shadow-sm"
        >
          Sell
        </button>
        <button className="px-3 py-2 border border-[var(--border-base)] rounded text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors flex items-center justify-center">
          <HiOutlineArrowRight />
        </button>
      </div>
    </div>
  );
};

export default PortfolioCard;
