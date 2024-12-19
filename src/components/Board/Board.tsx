import React, { useEffect, useRef, useState } from "react";
import "./Board.css";
import Tile from "../Tile/Tile";
import { stat } from "fs";
import ReactLoading from 'react-loading';

interface BoardProps {
    size: number;
   animal: 'wolf' | 'sheep';
    animalCount:number;
}

interface Pieces{
    image:string;
    x:number;
    y:number;

}

// pieces.push({image:`assets/images/rook_${type}.png`,x:0,y})
// pieces.push({image:`assets/images/rook_${type}.png`,x:7,y})

// pieces.push({image:`assets/images/knight_${type}.png`,x:1,y})
// pieces.push({image:`assets/images/knight_${type}.png`,x:6,y})

// pieces.push({image:`assets/images/bishop_${type}.png`,x:2,y})
// pieces.push({image:`assets/images/bishop_${type}.png`,x:5,y})

// pieces.push({image:`assets/images/queen_${type}.png`,x:3,y})
// pieces.push({image:`assets/images/king_${type}.png`,x:4,y})


const initialBoardState:Pieces[]=[];

for (let p=0;p<2;p++){
    const type=p===0?"b":"w";
    const y=p===0?7:0;

    initialBoardState.push({image:`assets/images/player_${type}.png`,x:0,y})
    initialBoardState.push({image:`assets/images/player_${type}.png`,x:7,y})

    initialBoardState.push({image:`assets/images/player_${type}.png`,x:1,y})
    initialBoardState.push({image:`assets/images/player_${type}.png`,x:6,y})

    initialBoardState.push({image:`assets/images/player_${type}.png`,x:2,y})
    initialBoardState.push({image:`assets/images/player_${type}.png`,x:5,y})

    initialBoardState.push({image:`assets/images/player_${type}.png`,x:3,y})
    initialBoardState.push({image:`assets/images/player_${type}.png`,x:4,y})


}

for(let i=0;i<8;i++){
    initialBoardState.push({image:"assets/images/player_b.png",x:i,y:6})
}
//pawn_b
for(let i=0;i<8;i++){
    initialBoardState.push({image:"assets/images/player_w.png",x:i,y:1})
}

export default function Board({ size,animal,animalCount }: BoardProps) {
    const [pieces,setPieces]= useState<Pieces[]>([])
    const [stateSpaceNo,setStateSpaceNo]= useState(0)
    const [loading,setLoading]= useState<Boolean>(false)

    const [gridX,setGridX]=useState(0);
    const [gridY,setGridY]=useState(0);
    const [activePiece,setActivePiece]=useState<HTMLElement|null>(null)
    const verticalAxis = Array.from({ length: size }, (_, i) => (i + 1).toString());
    const horizontalAxis = Array.from({ length: size }, (_, i) => String.fromCharCode(97 + i));
    const chessboardRef=useRef<HTMLDivElement>(null);

    const [activeButton, setActiveButton] = useState<string | null>(null); // Track active button

   const size100=size*100



function generateScenario(input:Pieces[], size:number,animal:'wolf' | 'sheep',animalCount:number) {
    console.log("Pieces",pieces)
    return {
        gridSize:size,
       scenario:animal==="wolf"?0:1,
      // scenario:0,
        solver:"",
        animalCount:animalCount,
//         initialPositions:input.map(({ x, y,image }) => {
//             return {
//                 row:  size-1-y,
//                 col:x,
//                 type:image==="assets/images/player_wolf.png"?'w':'s'
//             }
        
          
//     }
// )
    };
}

const callBruteForceAPI = async () => {
    setLoading(true)
    try {
        setActiveButton('BruteForce');
        
        let body=generateScenario(pieces, size,animal,animalCount);
        body={...body,solver:"bruteforce"}
        console.log(body);
        const response = await fetch('https://pure-coast-17015-3cd40f1d93b8.herokuapp.com/api/wolf-sheep/solve-scenario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        const initialBoardState: Pieces[] = [];
    
    // Populate the board with sheep positions
    data.sheep.forEach(([x, y] :[number, number]) => {
        initialBoardState.push({
            image: 'assets/images/player_sheep.png',
            x:y,
            y:size-1-x
        });
    });

    // Populate the board with wolf positions
    data.wolves.forEach(([x, y]: [number, number]) => {
        initialBoardState.push({
            image: 'assets/images/player_wolf.png',
            x:y,
            y:size-1-x
        });
    });
    setStateSpaceNo(data.state_space_explored)

    // Update the state with the prepared board
    setPieces(initialBoardState);
        console.log('Brute Force API Response:', data);
    } catch (error) {
        console.error('Error with Brute Force API:', error);
    }
    setLoading(false)
};

const callBacktrackingAPI = async () => {
    setLoading(true)
    try {
        setActiveButton('BackTracking');
        let body=generateScenario(pieces, size,animal,animalCount);
        body={...body,solver:"backtracking"}
        console.log(body);

        const response = await fetch('https://pure-coast-17015-3cd40f1d93b8.herokuapp.com/api/wolf-sheep/solve-scenario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        const initialBoardState: Pieces[] = [];
    
    // Populate the board with sheep positions
    data.sheep.forEach(([x, y] :[number, number]) => {
        initialBoardState.push({
            image: 'assets/images/player_sheep.png',
            x:y,
            y:size-1-x
        });
    });

    // Populate the board with wolf positions
    data.wolves.forEach(([x, y]: [number, number]) => {
        initialBoardState.push({
            image: 'assets/images/player_wolf.png',
            x:y,
            y:size-1-x
        });
    });
    setStateSpaceNo(data.state_space_explored)

    // Update the state with the prepared board
    setPieces(initialBoardState);
        console.log('Backtracking API Response:', data);
    } catch (error) {
        console.error('Error with Backtracking API:', error);
    }
    setLoading(false)

};

// const callOptimalSolutionAPI = async () => {
   
//     try {
//         setActiveButton('OptimalSolution');
//         let body=generateScenario(pieces, size,animal,animalCount);
//         body={...body,solver:"optimal"}
//         console.log(body);

//         const response = await fetch('http://localhost:8080/api/wolf-sheep/solve-scenario', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(body),
//         });
//         const data = await response.json();
//         const initialBoardState: Pieces[] = [];
    
//     // Populate the board with sheep positions
//     data.sheep.forEach(([x, y] :[number, number]) => {
//         initialBoardState.push({
//             image: 'assets/images/player_sheep.png',
//             x:y,
//             y:size-1-x
//         });
//     });

//     // Populate the board with wolf positions
//     data.wolves.forEach(([x, y]: [number, number]) => {
//         initialBoardState.push({
//             image: 'assets/images/player_wolf.png',
//             x:y,
//             y:size-1-x
//         });
//     });
//     setStateSpaceNo(data.state_space_explored)
//     // Update the state with the prepared board
//     setPieces(initialBoardState);
//         console.log('Backtracking API Response:', data);
//     } catch (error) {
//         console.error('Error with Backtracking API:', error);
//     }
// };

const output = generateScenario(pieces, size,animal,animalCount);
    console.log("Converted Coordinates :",JSON.stringify(output, null, 2));
    console.log("StateSpace : ",stateSpaceNo)
    useEffect(()=>{
    const initialBoardState:Pieces[]=[];

    const occupiedPositions = new Set();

    for (let i = 0; i < animalCount; i++) {
        let x, y, key;
        
        // Loop until we find an unused coordinate
        do {
            x = Math.floor(Math.random() * size);
            y = Math.floor(Math.random() * size);
            key = `${x},${y}`; // unique key for each coordinate
        } while (occupiedPositions.has(key));
        
        occupiedPositions.add(key); // mark the position as used
        initialBoardState.push({ image: `assets/images/player_${animal}.png`, x, y });
    }
    
    setPieces(initialBoardState)
    setActiveButton(null)
   },[size,animalCount,animal])
   

function grabPiece(e:React.MouseEvent){
    const element= e.target as HTMLElement;
    const chessboard = chessboardRef.current;

    if(element.classList.contains("chess-piece")&&chessboard){
        console.log(e)
     
        setGridX(Math.floor((e.clientX-chessboard.offsetLeft)/100))
        setGridY(Math.abs(Math.ceil((e.clientY-chessboard.offsetTop-size100)/100))) //mati
        const x=e.clientX-50;
        const y=e.clientY-50;
        element.style.position="absolute";
        element.style.left=`${x}px`;
        element.style.top=`${y}px`;
        setActivePiece(element)
    }
}

function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;  // Mati
      const minY = chessboard.offsetTop - 25;   // Mati
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75; // Mati
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75; // Mati 
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";

      //If x is smaller than minimum amount
      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      }
      //If x is bigger than maximum amount
      else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      }
      //If x is in the constraints
      else {
        activePiece.style.left = `${x}px`;
      }

      //If y is smaller than minimum amount
      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      }
      //If y is bigger than maximum amount
      else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      }
      //If y is in the constraints
      else {
        activePiece.style.top = `${y}px`;
      }
    }
  }

function dropPiece(e:React.MouseEvent){
    const chessboard=chessboardRef.current
    if(activePiece && chessboard){
        const x=Math.floor((e.clientX-chessboard.offsetLeft)/100)
        const y=Math.abs(Math.ceil((e.clientY-chessboard.offsetTop-size100)/100)) //mati

        setPieces((value)=>{
            const pieces=value.map((p)=>{
                if(p.x===gridX &&p.y===gridY){
                    p.x=x;
                    p.y=y
                }
                return p
            });
            return pieces
        })
       setActivePiece(null);
    }
}



    let board = [];
    for (let j = verticalAxis.length - 1; j >= 0; j--) {
        for (let i = 0; i < horizontalAxis.length; i++) {
            const number = j + i + 2;
            let image=undefined;

            pieces.forEach((p)=>{
                if(p.x===i && p.y===j){
                    image=p.image
                }
            })
           
                board.push(
                   <Tile key={`${j},${i}`} image={image} number={number}/>
                );
           
        }
    }
    if(!loading)
    return (
        <div>
             <div className="flex flex-row space-x-2 my-2 ">
                <button
                    type="button"
                    className={`w-full py-2 px-4 rounded-md ${
                        activeButton === 'BruteForce'
                            ? 'bg-green-600'
                            : 'bg-white'
                    } ${
                        activeButton === 'BruteForce'
                            ? 'text-white'
                            : 'text-black'
                    }  hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2`}
                    onClick={callBruteForceAPI}
                >
                    Brute Force
                </button>
                <button
                    type="button"
                    className={`w-full py-2 px-4 rounded-md ${
                        activeButton === 'BackTracking'
                            ? 'bg-green-600'
                            : 'bg-white'
                    } ${
                        activeButton === 'BackTracking'
                            ? 'text-white'
                            : 'text-black'
                    } hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2`}
                    onClick={callBacktrackingAPI}
                >
                    Back Tracking
                </button>
                {/* <button
                    type="button"
                    className={`w-full py-2 px-4 rounded-md ${
                        activeButton === 'OptimalSolution'
                            ? 'bg-green-600'
                            : 'bg-white'
                    } ${
                        activeButton === 'OptimalSolution'
                            ? 'text-white'
                            : 'text-black'
                    } hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2`}
                    onClick={callOptimalSolutionAPI}
                >
                    Optimal Solution
                </button> */}
            </div>
        <div
            id="chessboard"
            ref={chessboardRef}
            style={{ "--size": size } as React.CSSProperties}
            onMouseMove={(e)=>movePiece(e)}
            onMouseDown={e=>grabPiece(e)}
            onMouseUp={e=>dropPiece(e)}
        >
            {board}
        </div>

        {activeButton &&     <div className="rounded-lg overflow-hidden shadow-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 my-5">
   <div className="font-bold text-2xl text-white mb-4">
        The number of states generated :
        <span className="text-yellow-300 font-extrabold"> {stateSpaceNo} </span>
    </div>
    
</div>}
        </div>
    );
    else {
        return (<> <ReactLoading type={'spinningBubbles'} color={'#8643ea'} height={667} width={375} /></>)
    }
}
