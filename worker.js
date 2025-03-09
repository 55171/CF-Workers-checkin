from decimal import Decimal, getcontext
import time
import math

def calculate_pi_optimized(precision=1000, max_iterations=20):
    """高斯-勒让德算法优化版（修复稳定性问题）"""
    # 初始化动态精度环境
    getcontext().prec = precision + 100
    
    # 算法变量初始化
    a = Decimal(1)
    b = 1 / Decimal(2).sqrt()
    t = Decimal(0.25)
    p = Decimal(1)
    
    best_pi = Decimal(0)
    stable_count = 0
    start_time = time.time()
    iteration = 0  # 确保变量初始化
    
    try:
        print(f"目标精度: {precision} 位 | 最大迭代: {max_iterations}")
        print("开始计算...")
        
        for iteration in range(1, max_iterations + 1):
            a_prev, b_prev = a, b
            
            # ---------- 核心迭代 ----------
            a = (a + b) / 2
            b = (a_prev * b).sqrt()
            delta = a_prev - a
            delta_sq = delta ** 2
            
            # 数值稳定性检查
            if delta_sq.is_zero():
                print("警告：数值变化过小，提前终止")
                break
                
            t -= p * delta_sq
            p *= 2
            
            # ---------- π值计算 ----------
            denominator = 4 * t
            if denominator.is_zero():
                print("错误：除零异常")
                break
                
            current_pi = (a + b) ** 2 / denominator
            
            # ---------- 动态精度调整 ----------
            diff = abs(current_pi - best_pi)
            if diff != 0:
                try:
                    current_digits = min(precision, int(-diff.log10()))
                except:
                    current_digits = 0
                getcontext().prec = min(precision + 200, current_digits + 100)
            else:
                current_digits = precision
                getcontext().prec = precision + 100
            
            # ---------- 收敛检测 ----------
            if diff < Decimal(10) ** (-precision):
                stable_count += 1
                if stable_count >= 2:
                    print(f"达到精度要求（迭代 {iteration} 次）")
                    break
            else:
                stable_count = 0
                best_pi = current_pi
            
            # ---------- 进度输出 ----------
            if iteration % 5 == 0:
                elapsed = time.time() - start_time
                avg_time = elapsed / iteration
                remaining = avg_time * (max_iterations - iteration)
                print(f"Iter {iteration:03d} | 当前精度: {current_digits:05d} 位 | 剩余时间: {remaining:.1f}s")

    except KeyboardInterrupt:
        print("\n用户中断计算")
    except Exception as e:
        print(f"\n发生错误: {str(e)}")
    finally:
        # 结果处理
        getcontext().prec = precision
        best_pi = +best_pi
        total_time = time.time() - start_time
        
        print(f"\n计算报告:")
        print(f"实际迭代次数: {iteration} 次")
        print(f"总耗时: {total_time:.2f} 秒")
        print(f"最终精度: {len(str(best_pi).replace('.',''))} 位")
        print("\n结果片段:")
        print(str(best_pi)[:100] + "..." + str(best_pi)[-100:])
    
    return best_pi

if __name__ == "__main__":
    # 测试案例：计算1000位π
    calculate_pi_optimized(precision=100000, max_iterations=100)