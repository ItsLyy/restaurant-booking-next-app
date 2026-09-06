import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "./badge";

export const Calendar = () => {
  return (
    <div className="px-6 py-4 flex flex-col gap-4 border-b border-muted h-93">
      <div className="w-full flex justify-between items-center">
        <button type="button" aria-label="Previous month" className="group">
          <CaretLeftIcon className="size-6 text-foreground disabled:text-muted" />
        </button>
        <span className="text-foreground text-c-normal">April 2026</span>
        <button type="button" aria-label="Next month" className="group">
          <CaretRightIcon className="size-6 text-foreground group-disabled:text-muted" />
        </button>
      </div>
      <div className="flex flex-col gap-2 size-full">
        <div className="grid grid-cols-7 gap-2 *:text-center *:w-full *:text-foreground text-c-caption">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
        <div className="w-full grid grid-cols-7 grid-rows-5 gap-2 size-full">
          <Badge disabled>30</Badge>
          <Badge disabled>31</Badge>
          <Badge>1</Badge>
          <Badge>2</Badge>
          <Badge>3</Badge>
          <Badge>4</Badge>
          <Badge>5</Badge>
          <Badge>6</Badge>
          <Badge>7</Badge>
          <Badge>8</Badge>
          <Badge>9</Badge>
          <Badge>10</Badge>
          <Badge>11</Badge>
          <Badge>12</Badge>
          <Badge>13</Badge>
          <Badge>14</Badge>
          <Badge>15</Badge>
          <Badge>16</Badge>
          <Badge>17</Badge>
          <Badge>18</Badge>
          <Badge>19</Badge>
          <Badge>20</Badge>
          <Badge>21</Badge>
          <Badge>22</Badge>
          <Badge>23</Badge>
          <Badge>24</Badge>
          <Badge>25</Badge>
          <Badge>26</Badge>
          <Badge>27</Badge>
          <Badge>28</Badge>
          <Badge>29</Badge>
          <Badge>30</Badge>
          <Badge disabled>1</Badge>
          <Badge disabled>2</Badge>
          <Badge disabled>3</Badge>
        </div>
      </div>
    </div>
  );
};
