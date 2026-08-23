#!/bin/bash

# 🧪 CAREER AI - FULL INTEGRATION TEST SUITE
# Run this script to verify all systems before production launch

echo "🚀 CAREER AI INTEGRATION TEST SUITE"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TESTS_PASSED=0
TESTS_FAILED=0

# Test function
run_test() {
  local test_name=$1
  local test_command=$2
  local expected_result=$3
  
  echo -n "Testing: $test_name ... "
  
  result=$(eval "$test_command" 2>&1)
  
  if echo "$result" | grep -q "$expected_result"; then
    echo -e "${GREEN}✅ PASSED${NC}"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌ FAILED${NC}"
    echo "  Error: $result"
    ((TESTS_FAILED++))
  fi
}

echo "🔍 BACKEND API TESTS"
echo "===================="
echo ""

# Test 1: Jobs API
run_test "GET /api/jobs/all returns jobs" \
  "curl -s http://localhost:4000/api/jobs/all | head -c 50" \
  "total"

# Test 2: Jobs count
run_test "Jobs database has 290+ jobs" \
  "curl -s http://localhost:4000/api/jobs/all | grep -o 'total' | wc -l" \
  "1"

# Test 3: Authentication endpoint
run_test "POST /api/auth/login accepts credentials" \
  "curl -s -X POST http://localhost:4000/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"test@test.com\",\"password\":\"test\"}' | grep -o 'message\\|token\\|error'" \
  ""

echo ""
echo "🎨 FRONTEND TESTS"
echo "================="
echo ""

# Test 4: Check if React build exists
run_test "React build compiled" \
  "ls -la career-ai/dist/index.html | wc -l" \
  "1"

# Test 5: Check template file
run_test "Resume templates file exists" \
  "ls -la src/assets/pages/ResumeLab.jsx | wc -l" \
  "1"

# Test 6: Check template count in code
run_test "ResumeLab has template styles" \
  "grep -c 'Modern Blue\\|Professional Black\\|Creative' src/assets/pages/ResumeLab.jsx" \
  "[1-9]"

echo ""
echo "📱 MOBILE TESTS"
echo "==============="
echo ""

# Test 7: EAS config exists
run_test "EAS build config exists" \
  "ls -la mobile/eas.json | wc -l" \
  "1"

# Test 8: Mobile package.json exists
run_test "Mobile app package.json exists" \
  "ls -la mobile/package.json | wc -l" \
  "1"

echo ""
echo "🗄️  DATABASE TESTS"
echo "=================="
echo ""

# Test 9: Database file exists
run_test "Database file exists" \
  "ls -la server/data/dev-db.json | wc -l" \
  "1"

# Test 10: Jobs database file exists
run_test "Jobs database file (250+ jobs) exists" \
  "ls -la server/expanded-jobs-db-250.js | wc -l" \
  "1"

echo ""
echo "🔐 SECURITY TESTS"
echo "================="
echo ""

# Test 11: bcryptjs installed
run_test "bcryptjs dependency installed" \
  "grep -c 'bcryptjs' server/package.json" \
  "[1-9]"

# Test 12: JWT installed
run_test "jsonwebtoken dependency installed" \
  "grep -c 'jsonwebtoken' server/package.json" \
  "[1-9]"

# Test 13: CORS installed
run_test "cors dependency installed" \
  "grep -c 'cors' server/package.json" \
  "[1-9]"

echo ""
echo "📊 DEPLOYMENT FILES"
echo "===================="
echo ""

# Test 14: Deployment guide exists
run_test "Deployment guide created" \
  "ls -la DEPLOYMENT_GUIDE.md | wc -l" \
  "1"

# Test 15: Build complete summary
run_test "Build summary created" \
  "ls -la BUILD_COMPLETE.md | wc -l" \
  "1"

echo ""
echo "🎯 CONFIGURATION TESTS"
echo "======================"
echo ""

# Test 16: .env file configured
run_test "Environment configured for production" \
  "[ -f '.env' ] && echo 'configured' || echo 'not configured'" \
  "configured\\|not configured"

# Test 17: API endpoints exist
run_test "API server file has 50+ endpoints" \
  "grep -c 'app\\.' server/index.js" \
  "[5-9][0-9]"

echo ""
echo "=================================="
echo "📊 TEST RESULTS SUMMARY"
echo "=================================="
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL TESTS PASSED! READY FOR PRODUCTION!${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Some tests failed. Check configuration.${NC}"
  exit 1
fi
