#run pyhone command : python -m uvicorn main:app --reload

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/calculate")
async def calculate(data: dict):
    # Manual validation of the input data
    if not all(key in data for key in ['total_books', 'group_size']):
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    try:
        total_books = int(data['total_books'])
        group_size = int(data['group_size'])
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid number format")

    if total_books < 1 or group_size < 1:
        raise HTTPException(status_code=400, detail="Numbers must be positive")
    
    if group_size > total_books:
        raise HTTPException(
            status_code=400, 
            detail="Group size cannot be larger than total books"
        )
    
    result, dp_table = calculate_permutation(total_books, group_size)
    
    return {
        "result": result,
        "dp_table": dp_table
    }

def calculate_permutation(n: int, r: int):
    if r > n:
        return 0, []
    
    # Create DP table
    dp = [[0] * (r + 1) for _ in range(n + 1)]
    
    # Initialize base cases
    for i in range(n + 1):
        dp[i][0] = 1
        for j in range(1, min(i + 1, r + 1)):
            dp[i][j] = dp[i-1][j] + j * dp[i-1][j-1]
    
    return dp[n][r], dp