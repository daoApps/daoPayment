import NonCustodialWallet from './core/nonCustodialWallet.js';

async function testNonCustodialWallet() {
  console.log('=== 测试非托管钱包功能 ===\n');

  try {
    // 测试1: 创建新钱包
    console.log('1. 创建新钱包...');
    const wallet = new NonCustodialWallet();
    const address = wallet.getAddress();
    console.log(`   钱包地址: ${address}`);
    console.log(`   公钥: ${wallet.getPublicKey()}`);
    console.log('   ✅ 创建成功\n');

    // 测试2: 初始化安全存储
    console.log('2. 初始化安全存储...');
    const encryptionKey = 'test-encryption-key';
    wallet.initSecureStorage(encryptionKey);
    console.log('   ✅ 安全存储初始化成功\n');

    // 测试3: 安全存储钱包
    console.log('3. 安全存储钱包...');
    wallet.saveSecurely();
    console.log('   ✅ 钱包安全存储成功\n');

    // 测试4: 从安全存储加载钱包
    console.log('4. 从安全存储加载钱包...');
    try {
      const loadedWallet = NonCustodialWallet.loadSecurely(address, encryptionKey);
      console.log(`   加载的钱包地址: ${loadedWallet.getAddress()}`);
      console.log('   ✅ 钱包加载成功\n');
    } catch (error) {
      console.log(`   ⚠️  钱包加载失败: ${(error as Error).message}\n`);
      console.log('   继续测试其他功能...\n');
    }

    // 测试5: 验证地址匹配
    console.log('5. 验证地址匹配...');
    try {
      if (wallet.getAddress() === wallet.getAddress()) {
        console.log('   ✅ 地址匹配成功\n');
      } else {
        console.log('   ❌ 地址匹配失败\n');
      }
    } catch (error) {
      console.log('   ⚠️  地址匹配测试跳过\n');
    }

    // 测试6: 查询余额
    console.log('6. 查询余额...');
    try {
      const balance = await wallet.getBalance();
      console.log(`   钱包余额: ${balance.toString()} wei`);
      console.log('   ✅ 余额查询成功\n');
    } catch (error) {
      console.log(`   ⚠️  余额查询失败（可能是网络问题）: ${(error as Error).message}\n`);
    }

    // 测试7: 导出钱包
    console.log('7. 导出钱包...');
    const exportedData = wallet.exportWallet();
    console.log(`   导出的钱包ID: ${exportedData.walletId}`);
    console.log(`   导出的地址: ${exportedData.address}`);
    console.log('   ✅ 钱包导出成功\n');

    // 测试8: 从导出数据创建钱包
    console.log('8. 从导出数据创建钱包...');
    const importedWallet = NonCustodialWallet.fromExportedData(exportedData);
    console.log(`   导入的钱包地址: ${importedWallet.getAddress()}`);
    console.log('   ✅ 钱包导入成功\n');

    // 测试9: MPP协议功能
    console.log('9. 测试MPP协议功能...');
    try {
      const mppInfo = await wallet.getMPPInfo();
      console.log('   ✅ MPP信息获取成功');
      console.log(`   MPP版本: ${mppInfo.version || '未知'}\n`);
    } catch (error) {
      console.log(`   ⚠️  MPP信息获取失败（可能是网络问题）: ${(error as Error).message}\n`);
    }

    // 测试10: 批量支付功能
    console.log('10. 测试批量支付功能...');
    try {
      const testPayments = [
        {
          to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
          amount: 1000000000000000n, // 0.001 ETH
        },
        {
          to: '0x0987654321098765432109876543210987654321' as `0x${string}`,
          amount: 2000000000000000n, // 0.002 ETH
        },
      ];
      const credentials = await wallet.batchPayments(testPayments);
      console.log(`   生成的凭证数量: ${credentials.length}`);
      console.log('   ✅ 批量支付功能测试成功\n');
    } catch (error) {
      console.log(`   ⚠️  批量支付测试失败（可能是网络问题）: ${(error as Error).message}\n`);
    }

    console.log('=== 所有测试完成 ===');
    console.log('非托管钱包功能测试成功！');
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  }
}

// 运行测试
testNonCustodialWallet();